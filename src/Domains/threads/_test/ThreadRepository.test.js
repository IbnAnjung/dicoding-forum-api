const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository intrafece', () => {
  it('should throw error whn invoke unimplemented method', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.createThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
