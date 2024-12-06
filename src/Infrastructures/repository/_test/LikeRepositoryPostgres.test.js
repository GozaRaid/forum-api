const pool = require('../../database/postgres/pool');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const ThreadsTableTestHelp = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelp.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelp.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like and return added like correctly', async () => {
      // Arrange
      const addLike = new AddLike({
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(addLike);

      // Assert
      const likes = await LikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should persist delete like correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const owner = 'user-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({});

      // Action
      await likeRepositoryPostgres.deleteLike(commentId, owner);

      // Assert
      const likes = await LikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyLikeStatus function', () => {
    it('should return true when like found', async () => {
      // Arrange
      const commentId = 'comment-123';
      const owner = 'user-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({});

      // Action
      const likeStatus = await likeRepositoryPostgres.verifyLikeStatus(commentId, owner);

      // Assert
      expect(likeStatus).toBeTruthy();
    });

    it('should return false when like not found', async () => {
      // Arrange
      const commentId = 'comment-123';
      const owner = 'user-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeStatus = await likeRepositoryPostgres.verifyLikeStatus(commentId, owner);

      // Assert
      expect(likeStatus).toBeFalsy();
    });
  });

  describe('getAllLike function', () => {
    it('should return likes correctly', async () => {
      // Arrange
      const commentId = 'comment-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({});

      // Action
      const likes = await likeRepositoryPostgres.getAllLikes(commentId);

      // Assert
      expect(likes).toEqual(1);
    });
  });
});
