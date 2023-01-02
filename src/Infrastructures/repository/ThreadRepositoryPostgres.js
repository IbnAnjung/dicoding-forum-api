const CreateThread = require('../../Domains/threads/entities/CreateThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async createThread({
    id, title, content, userId,
  }) {
    const result = await this._pool.query({
      text: `INSERT INTO threads (id, title, content, user_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, content, user_id`,
      values: [id, title, content, userId],
    });

    const newThread = result.rows[0];
    return new CreateThread({
      id: newThread.id,
      title: newThread.title,
      content: newThread.content,
      userId: newThread.user_id,
    });
  }
}

module.exports = ThreadRepositoryPostgres;
