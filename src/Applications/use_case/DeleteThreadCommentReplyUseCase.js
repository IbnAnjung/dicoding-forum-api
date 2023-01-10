class DeleteThreadCommentReplyUseCase {
  constructor({
    threadRepository, threadCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute({
    userId, threadId, threadCommentId, threadCommentReplyId,
  }) {
    const thread = await this._threadRepository.verifyThreadAvailability(threadId);

    if (!thread) {
      throw new Error('THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
    }

    await this._threadCommentRepository.verifyThreadCommentReplyAndCommentReplyOwner({
      userId, threadCommentId, replyId: threadCommentReplyId,
    });

    await this._threadCommentRepository.deleteCommentReplyById(threadCommentReplyId);
  }
}

module.exports = DeleteThreadCommentReplyUseCase;
