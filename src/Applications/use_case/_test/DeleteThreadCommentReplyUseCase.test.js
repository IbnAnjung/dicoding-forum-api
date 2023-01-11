const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const DeleteThreadCommentReplyUseCase = require('../DeleteThreadCommentReplyUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');

describe('DeleteThreadCommentReplyUseCase', () => {
  it('should orchestratin the delete comment user action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comments-123';
    const threadCommentReplyId = 'reply-123';

    const threadRepository = new ThreadRepository();
    threadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    const threadCommentReplyRepository = new ThreadCommentReplyRepository();
    threadCommentReplyRepository.verifyThreadCommentReplyAndCommentReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    threadCommentReplyRepository.deleteCommentReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const useCase = new DeleteThreadCommentReplyUseCase({
      threadRepository, threadCommentReplyRepository,
    });

    await useCase.execute({
      threadId,
      userId,
      threadCommentId,
      threadCommentReplyId,
    });

    expect(threadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(threadCommentReplyRepository.verifyThreadCommentReplyAndCommentReplyOwner)
      .toBeCalledWith({
        userId,
        threadCommentId,
        replyId: threadCommentReplyId,
      });
    expect(threadCommentReplyRepository.deleteCommentReplyById)
      .toBeCalledWith(threadCommentReplyId);
  });

  it('should throw error when threadId not found', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comments-123';
    const threadCommentReplyId = 'reply-123';

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    const useCase = new DeleteThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    await expect(useCase.execute({
      threadId,
      userId,
      threadCommentId,
      threadCommentReplyId,
    })).rejects.toThrowError('THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
  });
});
