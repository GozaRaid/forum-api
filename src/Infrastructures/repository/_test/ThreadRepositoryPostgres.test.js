const ThreadsTableTestHelp = require('../../../../tests/ThreadsTableTestHelp');
const AddedThread = require('../../../Domains/thread/entities/AddedThread');
const AddThread = require('../../../Domains/thread/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelp.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'title',
        body: 'body',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const fakeIdGenerator = () => '123';

      const addedThread = await threadRepositoryPostgres.addThread(addThread, fakeIdGenerator);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
      }));
    });
  });
});
