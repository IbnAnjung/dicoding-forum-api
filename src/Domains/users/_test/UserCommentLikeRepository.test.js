const UserCommentLikeRepository = require('../UserCommentLikeRepository');

describe('The UserCommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const userCommentRepository = new UserCommentLikeRepository();

    await expect(userCommentRepository.isUserLikeComment({})).rejects.toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userCommentRepository.addLike({})).rejects.toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userCommentRepository.removeLike({})).rejects.toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
