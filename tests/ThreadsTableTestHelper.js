/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'title',
    body = 'body',
    owner = 'user-123', // Reference to user test helper
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $5)',
      values: [id, title, body, owner, createdAt],
    };

    await pool.query(query);
  },

  async findThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
