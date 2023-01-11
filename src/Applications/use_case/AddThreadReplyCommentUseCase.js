const AddNewThreadCommentReply = require('../../Domains/threads/entities/AddNewThreadCommentReply');

class AddThreadReplyCommentUseCase {
  constructor({
    threadCommentRepository, threadCommentReplyRepository,
  }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(payload) {
    const addNewThreadCommentReply = new AddNewThreadCommentReply(payload);
    await this._threadCommentRepository
      .verifyThreadCommentAvailabilty({
        threadId: addNewThreadCommentReply.threadId,
        threadCommentId: addNewThreadCommentReply.commentId,
      });

    const newReplyComment = await this._threadCommentReplyRepository
      .addNewReplyComment(addNewThreadCommentReply);
    return newReplyComment;
  }
}

module.exports = AddThreadReplyCommentUseCase;
