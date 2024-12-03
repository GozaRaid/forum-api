const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replys/entities/AddedReply');
const ReplyRepository = require('../../Domains/replys/ReplysRepository');
const CommentsRepositoryPostgres = require('./CommentRepositoryPostgres');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload) {
    const { commentId, content, owner } = payload;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replys (id, comment_id, content, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner',
      values: [id, commentId, content, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async verifyAvailabilityReply(replyId) {
    const query = {
      text: 'SELECT id FROM replys WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replys WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReplyById(replyId) {
    const updateAt = new Date().toISOString();
    const query = {
      text: 'UPDATE replys SET is_delete = true, updated_at = $2 WHERE id = $1 RETURNING id',
      values: [replyId, updateAt],
    };

    await this._pool.query(query);
  }

  async getAllReplies(commentId) {
    const query = {
      text: 'SELECT replys.id, replys.content, replys.is_delete, replys.created_at as date, users.username FROM replys JOIN users ON replys.owner = users.id WHERE replys.comment_id = $1 ORDER BY replys.created_at ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
