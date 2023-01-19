const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
  async addNewCommentReply({
    id, content, threadCommentId, userId, createdDate,
  }) {
    const date = (createdDate) || new Date();
    await pool.query({
      text: `INSERT INTO thread_comment_replies 
        (id, content, thread_comment_id, user_id, created_at) 
        VALUES ($1, $2, $3, $4, $5)`,
      values: [id, content, threadCommentId, userId, date],
    });
  },

  async findThreadCommentReplyById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [id],
    });
    return result.rows;
  },

  async getThreadReplyCommentByCommentId(id) {
    const result = await pool.query({
      text: 'SELECT * FROM thread_comment_replies WHERE thread_comment_id = $1',
      values: [id],
    });
    return result.rows;
  },

  async softDeleteThreadCommentById(id, deletedAt) {
    const result = await pool.query({
      text: 'UPDATE thread_comment_replies SET deleted_at = $2  WHERE id = $1',
      values: [id, deletedAt],
    });
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_replies where 1=1');
  },
};

module.exports = ThreadCommentRepliesTableTestHelper;
