const pool = require('../src/Infrastructures/database/postgres/pool');
const { cleanTable } = require('./UsersTableTestHelper');

const ThreadTableHelper = {
  async addNewThread({
    id = 'thread-123',
    title = 'new thread title',
    content = 'thread content',
    userId = 'user-123',
  }) {
    await pool.query({
      text: 'INSERT INTO threads (id, title, content, user_id) VALUES ($1, $2, $3, $4)',
      values: [id, title, content, userId],
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

module.exports = ThreadTableHelper;
