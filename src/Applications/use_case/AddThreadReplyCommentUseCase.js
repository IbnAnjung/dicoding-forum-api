const AddNewThreadReplyComment = require('../../Domains/threads/entities/AddNewThreadReplyComment');

class AddThreadReplyCommentUseCase {
  constructor({
    threadCommentRepository,
  }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(payload) {
    const addNewThreadReplyComment = new AddNewThreadReplyComment(payload);
    const comment = await this._threadCommentRepository
      .findCommentById(addNewThreadReplyComment.commentId);

    if (!comment) {
      throw new Error('ADD_NEW_THREAD_REPLY_COMMENT.THREAD_NOT_FOUND');
    }

    if (comment && comment.threadId !== addNewThreadReplyComment.threadId) {
      throw new Error('ADD_NEW_THREAD_REPLY_COMMENT.THREAD_NOT_FOUND');
    }

    const newReplyComment = await this._threadCommentRepository
      .addNewReplyComment(addNewThreadReplyComment);
    return newReplyComment;
  }
}

module.exports = AddThreadReplyCommentUseCase;
