const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replys/entities/AddReply');
const AddedReply = require('../../../Domains/replys/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ReplysTableTestHelper = require('../../../../tests/ReplysTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await ReplysTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const replyAdded = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const findReply = await ReplysTableTestHelper.findReplyById('reply-123');
      expect(replyAdded).toStrictEqual(expectedAddedReply);
      expect(findReply).toHaveLength(1);
    });
  });

  describe('verifyAvailabilityReply function', () => {
    it('should not throw NotFoundError when reply found', async () => {
      // Arrange
      await ReplysTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailabilityReply('reply-123'))
        .resolves.not.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailabilityReply('reply-123'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should not throw AuthorizationError when reply owner', async () => {
      // Arrange
      await ReplysTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });

    it('should throw AuthorizationError when reply not owner', async () => {
      // Arrange
      await ReplysTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456'))
        .rejects.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      await ReplysTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Assert
      const replies = await ReplysTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(0);
    });
  });

  describe('getAllReplies function', () => {
    it('should return all replies correctly', async () => {
      // Arrange
      const excepectedResultReply = {
        id: 'reply-123',
        content: 'reply',
        username: 'dicoding',
        is_delete: false,
      };
      await ReplysTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getAllReplies('comment-123');
      console.log(replies);
      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(excepectedResultReply.id);
      expect(replies[0].content).toEqual(excepectedResultReply.content);
      expect(replies[0].username).toEqual(excepectedResultReply.username);
      expect(replies[0].is_delete).toEqual(excepectedResultReply.is_delete);
      expect(replies[0]).toHaveProperty('date');
    });
  });
});
