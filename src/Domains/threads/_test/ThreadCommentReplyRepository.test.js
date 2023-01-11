const ThreadCommentReplyRepository = require('../ThreadCommentReplyRepository');

describe('ThreadCommentReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const repo = new ThreadCommentReplyRepository();

    await expect(repo.addNewReplyComment({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.verifyThreadCommentReplyAndCommentReplyOwner({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.deleteCommentReplyById()).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.getCommentRepliesByCommentIds()).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
