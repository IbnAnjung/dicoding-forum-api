const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewThreadComment = require('../../../Domains/threads/entities/NewThreadComment');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('a AddThreadCommentUseCase', () => {
  it('should orcestration the add comment user action correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      content: 'content',
      userId: 'user-123',
    };

    const newComment = new NewThreadComment({
      id: 'comment-123',
      content: payload.content,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    const mockThreadCommentRepository = new ThreadCommentRepository();
    mockThreadCommentRepository.addNewComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new NewThreadComment({
        id: 'comment-123',
        content: payload.content,
        owner: 'user-123',
      })));

    const useCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    const newThreadComment = await useCase.execute(payload);

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(payload.threadId);
    expect(mockThreadCommentRepository.addNewComment).toBeCalledWith(payload);
    expect(newThreadComment).toStrictEqual(newComment);
  });

  it('should throw error when threadId not found', async () => {
    const payload = {
      threadId: 'thread-123',
      content: 'content',
      userId: 'user-123',
    };

    const newComment = new NewThreadComment({
      id: 'comment-123',
      content: payload.content,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    const mockThreadCommentRepository = new ThreadCommentRepository();
    mockThreadCommentRepository.addNewComment = jest.fn()
      .mockImplementation(() => Promise.resolve(newComment));

    const useCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    await expect(useCase.execute(payload)).rejects
      .toThrowError('ADD_NEW_THREAD_COMMENT.THREAD_NOT_FOUND');
  });
});
