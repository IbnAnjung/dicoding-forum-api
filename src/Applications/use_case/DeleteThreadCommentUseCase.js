class DeleteThreadCommentUseCase {
  constructor({
    threadRepository, threadCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute({ userId, threadId, threadCommentId }) {
    const thread = await this._threadRepository.findThreadById(threadId);

    if (!thread) {
      throw new Error('DELETE_THREAD_COMMENT.THREAD_NOT_FOUND');
    }

    await this._threadCommentRepository.verifyThreadCommentAndCommentOwner({
      userId, threadCommentId,
    });

    await this._threadCommentRepository.deleteCommentById(threadCommentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
