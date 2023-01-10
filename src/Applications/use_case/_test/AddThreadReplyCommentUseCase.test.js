const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewThreadReplyComment = require('../../../Domains/threads/entities/NewThreadReplyComment');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadReplyCommentUseCase = require('../AddThreadReplyCommentUseCase');

describe('a AddThreadReplyCommentUseCase', () => {
  it('should orcestration the add comment user action correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      content: 'content',
      userId: 'user-123',
      commentId: 'comment-123',
    };

    const newReplyComment = new NewThreadReplyComment({
      id: 'reply-123',
      content: payload.content,
      owner: 'user-123',
    });

    const mockThreadCommentRepository = new ThreadCommentRepository();
    mockThreadCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
        commentId: 'comment-123',
      }));
    mockThreadCommentRepository.addNewReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new NewThreadReplyComment({
        id: 'reply-123',
        content: payload.content,
        owner: 'user-123',
      })));
    const useCase = new AddThreadReplyCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    const newThreadReplyComment = await useCase.execute(payload);

    expect(mockThreadCommentRepository.findCommentById)
      .toBeCalledWith(payload.commentId);
    expect(mockThreadCommentRepository.addNewReplyComment)
      .toBeCalledWith(payload);
    expect(newThreadReplyComment).toStrictEqual(newReplyComment);
  });

  it('should throw error when threadId and commentId not match', async () => {
    const payload = {
      threadId: 'thread-123',
      content: 'content',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();
    mockThreadCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(new NewThreadReplyComment({
        id: 'comment-123',
        content: payload.content,
        owner: 'user-123',
        threadId: 'another-thread',
      })));

    const useCase = new AddThreadReplyCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    await expect(useCase.execute(payload)).rejects
      .toThrowError('ADD_NEW_THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
  });

  it('should throw error when comment not found', async () => {
    const payload = {
      threadId: 'thread-123',
      content: 'content',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();
    mockThreadCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    const useCase = new AddThreadReplyCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    await expect(useCase.execute(payload)).rejects
      .toThrowError('ADD_NEW_THREAD_COMMENT_REPLY.THREAD_NOT_FOUND');
  });
});
