class UserCommentLikeRepository {
  async isUserLikeComment({ threadCommentId, userId }) {
    throw new Error('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addLike({ threadCommentId, userId }) {
    throw new Error('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async removeLike({ threadCommentId, userId }) {
    throw new Error('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserCommentLikeRepository;
