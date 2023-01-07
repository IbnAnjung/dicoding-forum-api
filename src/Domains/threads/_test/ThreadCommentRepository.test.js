const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const repo = new ThreadCommentRepository();

    await expect(repo.addNewComment({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented method', async () => {
    const repo = new ThreadCommentRepository();
    await expect(repo.verifyThreadCommentAndCommentOwner({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented method', async () => {
    const repo = new ThreadCommentRepository();
    await expect(repo.deleteCommentById()).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
