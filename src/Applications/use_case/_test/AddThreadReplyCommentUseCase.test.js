const NewThreadReplyComment = require('../../../Domains/threads/entities/NewThreadReplyComment');
const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const AddThreadReplyCommentUseCase = require('../AddThreadReplyCommentUseCase');

describe('a AddThreadReplyCommentUseCase', () => {
  it('should orcestration the add comment user action correctly', async () => {
    const payload = {
      content: 'content',
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const newReplyComment = new NewThreadReplyComment({
      id: 'reply-123',
      content: payload.content,
      owner: 'user-123',
    });

    const mockThreadCommentRepository = new ThreadCommentRepository();
    mockThreadCommentRepository.verifyThreadCommentAvailabilty = jest.fn()
      .mockImplementation(() => Promise.resolve({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
        commentId: 'comment-123',
      }));
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();
    mockThreadCommentReplyRepository.addNewReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new NewThreadReplyComment({
        id: 'reply-123',
        content: payload.content,
        owner: 'user-123',
      })));
    const useCase = new AddThreadReplyCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    const newThreadReplyComment = await useCase.execute(payload);

    expect(mockThreadCommentRepository.verifyThreadCommentAvailabilty)
      .toBeCalledWith({ threadCommentId: payload.commentId, threadId: payload.threadId });
    expect(mockThreadCommentReplyRepository.addNewReplyComment)
      .toBeCalledWith(payload);
    expect(newThreadReplyComment).toStrictEqual(newReplyComment);
  });

  it('should throw error when comment not found', async () => {
    const payload = {
      threadId: 'thread-123',
      content: 'content',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();
    mockThreadCommentRepository.verifyThreadCommentAvailabilty = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('ADD_NEW_THREAD_COMMENT_REPLY.THREAD_NOT_FOUND')));

    const useCase = new AddThreadReplyCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    await expect(useCase.execute(payload)).rejects
      .toThrowError('ADD_NEW_THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
  });
});
