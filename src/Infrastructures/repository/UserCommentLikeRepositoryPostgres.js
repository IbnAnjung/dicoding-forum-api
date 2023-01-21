const UserCommentLikeRepository = require('../../Domains/users/UserCommentLikeRepository');

class UserCommentLikeRepositoryPostgres extends UserCommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async isUserLikeComment({ threadCommentId, userId }) {
    const res = await this._pool.query({
      text: `SELECT * FROM user_comment_likes 
        WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, threadCommentId],
    });

    if (!res.rowCount) return false;

    return true;
  }

  async addLike({ threadCommentId, userId }) {
    await this._pool.query({
      text: `INSERT INTO user_comment_likes (user_id, comment_id)
        VALUES ($1, $2)`,
      values: [userId, threadCommentId],
    });
  }

  async removeLike({ threadCommentId, userId }) {
    await this._pool.query({
      text: `DELETE FROM user_comment_likes
        WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, threadCommentId],
    });
  }
}

module.exports = UserCommentLikeRepositoryPostgres;
