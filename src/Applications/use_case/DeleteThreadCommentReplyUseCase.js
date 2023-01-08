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
    const thread = await this._threadRepository.findThreadById(threadId);

    if (!thread) {
      throw new Error('DELETE_THREAD_COMMENT.THREAD_NOT_FOUND');
    }

    await this._threadCommentRepository.verifyThreadCommentReplyAndCommentReplyOwner({
      userId, threadCommentId, replyId: threadCommentReplyId,
    });

    await this._threadCommentRepository.deleteCommentReplyById(threadCommentReplyId);
  }
}

module.exports = DeleteThreadCommentReplyUseCase;
