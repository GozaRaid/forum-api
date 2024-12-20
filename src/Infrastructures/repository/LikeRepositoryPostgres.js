const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(payload) {
    const { commentId, owner } = payload;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes (id, owner, comment_id) VALUES($1, $2, $3) returning id',
      values: [id, owner, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async verifyLikeStatus(commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) return false;
    return true;
  }

  async getAllLikes(commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }

  // async getAllLikes(commentIds) {
  //   const ids = Array.isArray(commentIds) ? commentIds : [commentIds];

  //   const query = {
  //     text: `SELECT comment_id, COUNT(*) AS like_count
  //            FROM likes WHERE comment_id = ANY($1::text[]) GROUP BY comment_id',
  //     values: [ids],
  //   };
  //   const result = await this._pool.query(query);

  //   return result.rows.reduce((acc, row) => {
  //     acc[row.comment_id] = parseInt(row.like_count, 10);
  //     return acc;
  //   }, {});
  // }
}

module.exports = LikeRepositoryPostgres;
