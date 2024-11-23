const CommentsRepository = require('../../Domains/comments/CommentsRepostitory');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

  async checkAvailabilityComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1 RETURNING id',
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentsRepositoryPostgres;
