class ThreadDetail {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.username = payload.username;
    this.date = payload.date;
    this.comments = payload.comments;
  }

  verifyPayload({
    id, title, body, username, date, comments = [],
  }) {
    if (!id || !title || !body || !username || !date) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof username !== 'string'
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!Array.isArray(comments)) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const validateComment = (comment) => {
      if (!comment.id || !comment.username || !comment.date || !comment.content) {
        throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof comment.id !== 'string' || typeof comment.username !== 'string'
          || typeof comment.content !== 'string'
      ) {
        throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }

      if (!(new Date(comment.date).getTime() > 0)) {
        throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    };

    comments.forEach((comment) => {
      validateComment(comment);
      if (Array.isArray(comment.replies)) {
        comment.replies.forEach((reply) => {
          validateComment(reply);
        });
      }
    });

    if (!(new Date(date).getTime() > 0)) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadDetail;
