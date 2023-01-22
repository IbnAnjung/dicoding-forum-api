class ToggleLikeCommentUseCase {
  constructor({
    threadCommentRepository, userCommentLikeRepository,
  }) {
    this._threadCommentReposytory = threadCommentRepository;
    this._userCommentLikeRepository = userCommentLikeRepository;
  }

  async execute({ userId, threadId, threadCommentId }) {
    await this._threadCommentReposytory
      .verifyThreadCommentAvailabilty({
        threadId,
        threadCommentId,
      });

    const isUserLikeComment = await this._userCommentLikeRepository.isUserLikeComment({
      userId, threadCommentId,
    });

    if (!isUserLikeComment) {
      this._userCommentLikeRepository.addLike({ userId, threadCommentId });
    } else {
      this._userCommentLikeRepository.removeLike({ userId, threadCommentId });
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
