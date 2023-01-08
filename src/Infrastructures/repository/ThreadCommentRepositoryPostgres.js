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
    const createdAt = new Date().toISOString();

    const res = await this._pool.query({
      text: `INSERT INTO thread_comments (id, content, thread_id, user_id, created_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, content, user_id`,
      values: [id, content, threadId, userId, createdAt],
    });

    const newComment = res.rows[0];
    return new NewThreadComment({
      id: newComment.id,
      content: newComment.content,
      owner: newComment.user_id,
    });
  }

  async addNewReplyComment({
    threadId, content, userId, commentId,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const res = await this._pool.query({
      text: `INSERT INTO thread_comments (id, content, thread_id, user_id, created_at, comment_parent_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id`,
      values: [id, content, threadId, userId, createdAt, commentId],
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

  async getCommentByThreadId(threadId) {
    const comments = await this._pool.query({
      text: `SELECT "thread_comments".id, "users".username,
        "thread_comments".created_at date,"thread_comments".deleted_at deleted,
        "thread_comments".content
        FROM "thread_comments" 
        JOIN "users" ON "thread_comments".user_id = "users".id
        WHERE "thread_comments".thread_id = $1
          AND "thread_comments".comment_parent_id IS NULL
        ORDER BY "thread_comments".created_at ASC`,
      values: [threadId],
    });

    return comments.rows;
  }

  async getCommentRepliesByCommentIds(commentIds) {
    const comments = await this._pool.query({
      text: `SELECT "thread_comments".id, "users".username, "thread_comments".comment_parent_id comment,
        "thread_comments".created_at date,"thread_comments".deleted_at deleted,
        "thread_comments".content
        FROM "thread_comments" 
        JOIN "users" ON "thread_comments".user_id = "users".id
        WHERE "thread_comments".comment_parent_id = ANY ($1)
        ORDER BY "thread_comments".created_at ASC`,
      values: [commentIds],
    });

    return comments.rows;
  }

  async findCommentById(commentId) {
    const res = await this._pool.query({
      text: `SELECT id, thread_id, user_id, content
        FROM thread_comments WHERE id = $1`,
      values: [commentId],
    });

    if (!res.rowCount) {
      return null;
    }

    const comment = res.rows[0];
    return {
      id: comment.id,
      content: comment.content,
      threadId: comment.thread_id,
      owner: comment.user_id,
    };
  }
}

module.exports = ThreadCommentRepositoryPostgres;
