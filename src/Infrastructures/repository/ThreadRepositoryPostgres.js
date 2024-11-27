const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const AddedThread = require('../../Domains/thread/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const { title, body, owner } = payload;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getDetailThreadById(threadId) {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.updated_at as date, users.username FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
