const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addNewComment({
    id, content, threadId, userId, createdDate,
  }) {
    const date = (createdDate) || new Date();
    await pool.query({
      text: `INSERT INTO thread_comments 
        (id, content, thread_id, user_id, created_at) 
        VALUES ($1, $2, $3, $4, $5)`,
      values: [id, content, threadId, userId, date],
    });
  },

  async findThreadCommentById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    });
    return result.rows;
  },

  async softDeleteThreadCommentById(id, deletedAt) {
    const result = await pool.query({
      text: 'UPDATE thread_comments SET deleted_at = $2  WHERE id = $1',
      values: [id, deletedAt],
    });
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments where 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
