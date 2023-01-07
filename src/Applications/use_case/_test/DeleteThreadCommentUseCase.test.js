const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestratin the delete comment yser action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comments-123';

    const thread = new NewThread({
      id: threadId,
      title: 'title',
      owner: 'user-thread-owner',
    });
    const threadRepository = new ThreadRepository();
    threadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

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

    expect(threadRepository.findThreadById).toBeCalledWith(threadId);
    expect(threadCommentRepository.verifyThreadCommentAndCommentOwner).toBeCalledWith({
      userId,
      threadCommentId,
    });
    expect(threadCommentRepository.deleteCommentById).toBeCalledWith(threadCommentId);
  });
});
