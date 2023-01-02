const UserLogin = require('../../users/entities/UserLogin');

class CreateThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.content = payload.content;
    this.userId = payload.userId;
  }

  _verifyPayload({
    id, title, content, userId,
  }) {
    if (!id || !title || !content || !userId) {
      throw new Error('ADD_NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof content !== 'string' || typeof userId !== 'string') {
      throw new Error('ADD_NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateThread;
