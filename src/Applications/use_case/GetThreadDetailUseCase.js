/* eslint-disable no-param-reassign */
class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute({ threadId }) {
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    if (!thread) {
      throw new Error('THREAD_DETAIL.THREAD_NOT_FOUND');
    }

    const comments = await this._threadCommentRepository.getCommentByThreadId(threadId);
    thread.comments = comments.map((comment) => {
      if (comment.deleted) {
        comment.content = '**komentar telah dihapus**';
      }

      delete comment.deleted;
      return comment;
    });

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
