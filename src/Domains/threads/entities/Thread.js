class NewThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  verifyPayload({
    id, title, content, owner,
  }) {
    if (!id || !title || !content || !owner) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
