const AddNewThreadComment = require('../../Domains/threads/entities/AddNewThreadComment');

class AddThreadCommentUseCase {
  constructor({
    threadRepository, threadCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(payload) {
    const addNewThreadComment = new AddNewThreadComment(payload);
    const thread = await this._threadRepository.findThreadById(addNewThreadComment.threadId);

    if (!thread) {
      throw new Error('ADD_NEW_THREAD_COMMENT.THREAD_NOT_FOUND');
    }

    const newComment = await this._threadCommentRepository.addNewComment(addNewThreadComment);
    return newComment;
  }
}

module.exports = AddThreadCommentUseCase;
