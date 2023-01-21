const UserCommentLikeRepository = require('../../Domains/users/UserCommentLikeRepository');

class UserCommentLikeRepositoryPostgres extends UserCommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async isUserLikeComment({ commentId, userId }) {
    const res = await this._pool.query({
      text: `SELECT * FROM user_comment_likes 
        WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, commentId],
    });

    if (!res.rowCount) return false;

    return true;
  }

  async addLike({ commentId, userId }) {
    await this._pool.query({
      text: `INSERT INTO user_comment_likes (user_id, comment_id)
        VALUES ($1, $2)`,
      values: [userId, commentId],
    });
  }

  async removeLike({ commentId, userId }) {
    await this._pool.query({
      text: `DELETE FROM user_comment_likes
        WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, commentId],
    });
  }
}

module.exports = UserCommentLikeRepositoryPostgres;
