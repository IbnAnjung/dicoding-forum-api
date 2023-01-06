class AddNewThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.userId = payload.userId;
    this.threadId = payload.threadId;
  }

  _verifyPayload({ content, threadId, userId }) {
    if (!content || !threadId || !userId) {
      throw new Error('CREATE_NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
      throw new Error('CREATE_NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddNewThreadComment;
