const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async createThread({
    id = 'thread-123',
    title = 'new thread title',
    content = 'thread content',
    userId = 'user-123',
    createdDate = null,
  }) {
    let date = createdDate;
    if (!createdDate) {
      date = new Date();
    }
    await pool.query({
      text: 'INSERT INTO threads (id, title, content, user_id, created_at) VALUES ($1, $2, $3, $4, $5)',
      values: [id, title, content, userId, date],
    });
  },

  async findThreadById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    });
    return result.rows;
  },

  async getThreadByUserId(userId) {
    const result = await pool.query({
      text: 'SELECT * FROM threads WHERE user_id = $1',
      values: [userId],
    });
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads where 1=1');
  },

};

module.exports = ThreadsTableTestHelper;
