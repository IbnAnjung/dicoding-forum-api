const AddNewThreadCommentReply = require('../../Domains/threads/entities/AddNewThreadCommentReply');

class AddThreadReplyCommentUseCase {
  constructor({
    threadCommentRepository,
  }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(payload) {
    const addNewThreadCommentReply = new AddNewThreadCommentReply(payload);
    const comment = await this._threadCommentRepository
      .findCommentById(addNewThreadCommentReply.commentId);

    if (!comment) {
      throw new Error('ADD_NEW_THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
    }

    if (comment && comment.threadId !== addNewThreadCommentReply.threadId) {
      throw new Error('ADD_NEW_THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
    }

    const newReplyComment = await this._threadCommentRepository
      .addNewReplyComment(addNewThreadCommentReply);
    return newReplyComment;
  }
}

module.exports = AddThreadReplyCommentUseCase;
