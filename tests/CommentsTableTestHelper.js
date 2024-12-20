/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123', // Reference to thread test helper
    content = 'comment',
    owner = 'user-123', // Reference to user test helper
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments (id, thread_id, content, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $5)',
      values: [id, threadId, content, owner, createdAt],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
