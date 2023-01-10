class DeleteThreadCommentUseCase {
  constructor({
    threadRepository, threadCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute({ userId, threadId, threadCommentId }) {
    const thread = await this._threadRepository.verifyThreadAvailability(threadId);

    if (!thread) {
      throw new Error('THREAD_COMMENT.THREAD_NOT_FOUND');
    }

    await this._threadCommentRepository.verifyThreadCommentAndCommentOwner({
      userId, threadCommentId,
    });

    await this._threadCommentRepository.deleteCommentById(threadCommentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
