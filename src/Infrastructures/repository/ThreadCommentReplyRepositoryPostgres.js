const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const NewThreadReplyComment = require('../../Domains/threads/entities/NewThreadReplyComment');
const ThreadCommentReplyRepository = require('../../Domains/threads/ThreadCommentReplyRepository');

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;

    this.addNewReplyComment = this.addNewReplyComment.bind(this);
    this.verifyThreadCommentReplyAndCommentReplyOwner = this
      .verifyThreadCommentReplyAndCommentReplyOwner.bind(this);
  }

  async addNewReplyComment({
    content, userId, commentId,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date();

    const res = await this._pool.query({
      text: `INSERT INTO thread_comment_replies (id, content, user_id, created_at, thread_comment_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, content, user_id`,
      values: [id, content, userId, createdAt, commentId],
    });

    const newComment = res.rows[0];
    return new NewThreadReplyComment({
      id: newComment.id,
      content: newComment.content,
      owner: newComment.user_id,
    });
  }

  async verifyThreadCommentReplyAndCommentReplyOwner({
    replyId, threadCommentId, userId,
  }) {
    const query = {
      text: `SELECT user_id 
        FROM thread_comment_replies WHERE id = $1
          AND thread_comment_id = $2`,
      values: [replyId, threadCommentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    if (result.rows[0].user_id !== userId) {
      throw new AuthorizationError('Kamu bukan pemilik comment ini');
    }
  }

  async getCommentRepliesByCommentIds(commentIds) {
    const comments = await this._pool.query({
      text: `SELECT "thread_comment_replies".id, "users".username, "thread_comments".id comment,
        "thread_comment_replies".created_at date,"thread_comment_replies".deleted_at deleted,
        "thread_comment_replies".content
        FROM "thread_comment_replies"
        JOIN "thread_comments" ON "thread_comment_replies".thread_comment_id = "thread_comments".id 
        JOIN "users" ON "thread_comment_replies".user_id = "users".id
        WHERE "thread_comment_replies".thread_comment_id = ANY ($1)
        ORDER BY "thread_comment_replies".id ASC`,
      values: [commentIds],
    });

    return comments.rows;
  }

  async deleteCommentReplyById(id) {
    const timestamps = new Date();
    await this._pool.query({
      text: `UPDATE thread_comment_replies SET deleted_at=$1
        WHERE id = $2`,
      values: [timestamps, id],
    });
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
