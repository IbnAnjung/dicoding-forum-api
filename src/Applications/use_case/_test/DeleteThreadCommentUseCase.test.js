const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestratin the delete comment user action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comments-123';

    const threadRepository = new ThreadRepository();
    threadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    const threadCommentRepository = new ThreadCommentRepository();
    threadCommentRepository.verifyThreadCommentAndCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    threadCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const useCase = new DeleteThreadCommentUseCase({
      threadRepository, threadCommentRepository,
    });

    await useCase.execute({
      threadId,
      userId,
      threadCommentId,
    });

    expect(threadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(threadCommentRepository.verifyThreadCommentAndCommentOwner).toBeCalledWith({
      userId,
      threadCommentId,
    });
    expect(threadCommentRepository.deleteCommentById).toBeCalledWith(threadCommentId);
  });

  it('should throw error when thread not found', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comments-123';

    const threadRepository = new ThreadRepository();
    threadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    const threadCommentRepository = new ThreadCommentRepository();

    const useCase = new DeleteThreadCommentUseCase({
      threadRepository, threadCommentRepository,
    });

    await expect(useCase.execute({
      threadId,
      userId,
      threadCommentId,
    })).rejects.toThrowError('THREAD_COMMENT.THREAD_NOT_FOUND');
  });
});
