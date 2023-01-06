const CreateThread = require('../../Domains/threads/entities/CreateThread');
const NewThread = require('../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread({
    title, content, userId,
  }) {
    const id = `thread-${this._idGenerator()}`;

    const result = await this._pool.query({
      text: `INSERT INTO threads (id, title, content, user_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, content, user_id`,
      values: [id, title, content, userId],
    });

    const newThread = result.rows[0];
    return new NewThread({
      id: newThread.id,
      title: newThread.title,
      owner: newThread.user_id,
    });
  }
}

module.exports = ThreadRepositoryPostgres;
