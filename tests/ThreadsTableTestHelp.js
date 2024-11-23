/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('./UsersTableTestHelper'); // Make sure this path is correct

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'title',
    body = 'body',
    owner = 'user-123', // Reference to a user
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  }) {
    // Ensure the owner exists in the users table
    await UsersTableTestHelper.addUser({ id: owner });

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, owner, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
