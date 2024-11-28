const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/thread/entities/AddThread');
const AddedThread = require('../../../Domains/thread/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const findThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addedThread).toStrictEqual(expectedAddedThread);
      expect(findThread).toHaveLength(1);
    });
  });

  describe('verifyAvailabilityThread function', () => {
    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailabilityThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailabilityThread('thread-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThreadById function', () => {
    it('should return detail thread correctly', async () => {
      // Arrange
      const expectedDetailThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        username: 'dicoding',
      };

      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread = await threadRepositoryPostgres.getDetailThreadById('thread-123');

      // Assert
      expect(detailThread).toBeDefined();
      expect(detailThread.id).toStrictEqual(expectedDetailThread.id);
      expect(detailThread.title).toStrictEqual(expectedDetailThread.title);
      expect(detailThread.body).toStrictEqual(expectedDetailThread.body);
      expect(detailThread.username).toStrictEqual(expectedDetailThread.username);
      expect(detailThread).toHaveProperty('date');
    });
  });
});
