class AddNewThreadCommentReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.userId = payload.userId;
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
  }

  _verifyPayload({
    content, threadId, userId, commentId,
  }) {
    if (!content || !threadId || !userId || !commentId) {
      throw new Error('ADD_NEW_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string'
      || typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADD_NEW_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddNewThreadCommentReply;
