const CommentsRepository = require('../../Domains/comments/CommentsRepostitory');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentsRepositoryPostgres extends CommentsRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, owner, content) {
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments (id, thread_id, content, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner',
      values: [id, threadId, content, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }
}

module.exports = CommentsRepositoryPostgres;
