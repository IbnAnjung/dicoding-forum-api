const pool = require('../src/Infrastructures/database/postgres/pool');

const UserCommentLikesTableTestHelper = {
  async addLike({
    userId, commentId,
  }) {
    await pool.query({
      text: `INSERT INTO user_comment_likes 
        (user_id, comment_id) 
        VALUES ($1, $2)`,
      values: [userId, commentId],
    });
  },

  async findUserCommentLike({ userId, commentId }) {
    const result = await pool.query({
      text: `SELECT * FROM user_comment_likes
        WHERE user_id = $1 and comment_id = $2`,
      values: [userId, commentId],
    });

    return result.rows;
  },

  async getUserCommentLike(commentId) {
    const result = await pool.query({
      text: `SELECT * FROM user_comment_likes
        WHERE comment_id = $1`,
      values: [commentId],
    });

    return result.rows;
  },

  async deleteUserCommentLike({ userId, commentId }) {
    await pool.query({
      text: `DELETE user_comment_likes 
        WHERE user_id = $1 and comment_id = $2`,
      values: [userId, commentId],
    });
  },
};

module.exports = UserCommentLikesTableTestHelper;
