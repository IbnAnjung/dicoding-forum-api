class DeleteThreadCommentReplyUseCase {
  constructor({
    threadRepository, threadCommentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute({
    userId, threadId, threadCommentId, threadCommentReplyId,
  }) {
    const thread = await this._threadRepository.verifyThreadAvailability(threadId);

    if (!thread) {
      throw new Error('THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
    }

    await this._threadCommentReplyRepository.verifyThreadCommentReplyAndCommentReplyOwner({
      userId, threadCommentId, replyId: threadCommentReplyId,
    });

    await this._threadCommentReplyRepository.deleteCommentReplyById(threadCommentReplyId);
  }
}

module.exports = DeleteThreadCommentReplyUseCase;
