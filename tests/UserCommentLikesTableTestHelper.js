const pool = require('../src/Infrastructures/database/postgres/pool');

const UserCommentLikesTableTestHelper = {
  async addLike({
    userId, threadCommentId,
  }) {
    await pool.query({
      text: `INSERT INTO user_comment_likes 
        (user_id, comment_id) 
        VALUES ($1, $2)`,
      values: [userId, threadCommentId],
    });
  },

  async findUserCommentLike({ userId, threadCommentId }) {
    const result = await pool.query({
      text: `SELECT * FROM user_comment_likes
        WHERE user_id = $1 and comment_id = $2`,
      values: [userId, threadCommentId],
    });

    return result.rows;
  },

  async getUserCommentLike(threadCommentId) {
    const result = await pool.query({
      text: `SELECT * FROM user_comment_likes
        WHERE comment_id = $1`,
      values: [threadCommentId],
    });

    return result.rows;
  },

  async deleteUserCommentLike({ userId, threadCommentId }) {
    await pool.query({
      text: `DELETE user_comment_likes 
        WHERE user_id = $1 and comment_id = $2`,
      values: [userId, threadCommentId],
    });
  },
};

module.exports = UserCommentLikesTableTestHelper;
