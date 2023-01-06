const NewThreadComment = require('../../Domains/threads/entities/NewThreadComment');
const ThreadCommentRepository = require('../../Domains/threads/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewComment({
    threadId, content, userId,
  }) {
    const id = `comment-${this._idGenerator()}`;
    const res = await this._pool.query({
      text: `INSERT INTO thread_comments (id, content, thread_id, user_id)
        VALUES ($1, $2, $3, $4) RETURNING id, content, user_id`,
      values: [id, content, threadId, userId],
    });

    const newComment = res.rows[0];
    return new NewThreadComment({
      id: newComment.id,
      content: newComment.content,
      owner: newComment.user_id,
    });
  }
}

module.exports = ThreadCommentRepositoryPostgres;
