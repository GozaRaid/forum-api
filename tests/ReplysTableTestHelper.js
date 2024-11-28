/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplysTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'reply',
    owner = 'user-123',
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO replys (id, comment_id, content, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $5)',
      values: [id, commentId, content, owner, createdAt],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replys WHERE id=$1 AND is_delete=FALSE',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replys WHERE 1=1');
  },
};

module.exports = ReplysTableTestHelper;
