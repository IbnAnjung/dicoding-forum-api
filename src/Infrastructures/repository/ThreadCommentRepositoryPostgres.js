const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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

  async verifyThreadCommentAndCommentOwner({ threadCommentId, userId }) {
    const query = {
      text: `SELECT user_id 
        FROM thread_comments WHERE id = $1`,
      values: [threadCommentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    if (result.rows[0].user_id !== userId) {
      throw new AuthorizationError('Kamu bukan pemilik comment ini');
    }
  }

  async deleteCommentById(threadCommentId) {
    const timestamps = new Date().toISOString();
    await this._pool.query({
      text: `UPDATE thread_comments SET deleted_at=$1
        WHERE id = $2`,
      values: [timestamps, threadCommentId],
    });
  }
}

module.exports = ThreadCommentRepositoryPostgres;
