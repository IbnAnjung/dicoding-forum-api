class CreateThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.content = payload.content;
    this.userId = payload.userId;
  }

  _verifyPayload({
    title, content, userId,
  }) {
    if (!title || !content || !userId) {
      throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof content !== 'string' || typeof userId !== 'string') {
      throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateThread;
