class UserCommentLikeRepository {
  async isUserLikeComment({ commentId, userId }) {
    throw new Error('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addLike({ commentId, userId }) {
    throw new Error('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async removeLike({ commentId, userId }) {
    throw new Error('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserCommentLikeRepository;
