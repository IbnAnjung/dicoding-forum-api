class NewThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  verifyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = NewThread;
