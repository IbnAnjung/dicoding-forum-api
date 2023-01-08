const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addNewComment({
    id, content, threadId, userId,
  }) {
    await pool.query({
      text: 'INSERT INTO thread_comments (id, content, thread_id, user_id) VALUES ($1, $2, $3, $4)',
      values: [id, content, threadId, userId],
    });
  },

  async findThreadCommentById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    });
    return result.rows;
  },

  async getThreadReplyCommentByCommentId(id) {
    const result = await pool.query({
      text: 'SELECT * FROM thread_comments WHERE comment_parent_id = $1',
      values: [id],
    });
    return result.rows;
  },

  async softDeleteThreadCommentById(id) {
    const now = new Date().toISOString();
    const result = await pool.query({
      text: 'UPDATE thread_comments SET deleted_at = $2  WHERE id = $1',
      values: [id, now],
    });
    return result.rows;
  },

  async getThreadCommentThreadId(id) {
    const result = await pool.query({
      text: 'SELECT * FROM thread_comments WHERE thread_id = $1',
      values: [id],
    });
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads where 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
