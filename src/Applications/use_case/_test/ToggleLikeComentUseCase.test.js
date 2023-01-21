const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');
const UserCommentLikeRepository = require('../../../Domains/users/UserCommentLikeRepository');
const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');

describe('a ToggleLikeCommentUseCase', () => {
  it('should orcestration the toggleLikeComment correctly to like comment', async () => {
    const payload = {
      threadId: 'thread-123',
      threadCommentId: 'comment-123',
      userId: 'user-123',
    };

    const threadCommentRepository = new ThreadCommentReplyRepository();
    threadCommentRepository.verifyThreadCommentAvailabilty = jest.fn()
      .mockImplementation(() => Promise.resolve({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
        commentId: 'comment-123',
      }));

    const userCommentLikeRepository = new UserCommentLikeRepository();
    userCommentLikeRepository.isUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    userCommentLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const usecase = new ToggleLikeCommentUseCase({
      threadCommentRepository,
      userCommentLikeRepository,
    });

    await usecase.execute(payload);

    expect(threadCommentRepository.verifyThreadCommentAvailabilty)
      .toBeCalledWith({ threadCommentId: payload.threadCommentId, threadId: payload.threadId });
    expect(userCommentLikeRepository.isUserLikeComment)
      .toBeCalledWith({ threadCommentId: payload.threadCommentId, userId: payload.userId });
    expect(userCommentLikeRepository.addLike)
      .toBeCalledWith({ threadCommentId: payload.threadCommentId, userId: payload.userId });
  });

  it('should orcestration the toggleLikeComment correctly if user already like comment', async () => {
    const payload = {
      threadId: 'thread-123',
      threadCommentId: 'comment-123',
      userId: 'user-123',
    };

    const threadCommentRepository = new ThreadCommentReplyRepository();
    threadCommentRepository.verifyThreadCommentAvailabilty = jest.fn()
      .mockImplementation(() => Promise.resolve({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
        commentId: 'comment-123',
      }));

    const userCommentLikeRepository = new UserCommentLikeRepository();
    userCommentLikeRepository.isUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    userCommentLikeRepository.removeLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const usecase = new ToggleLikeCommentUseCase({
      threadCommentRepository,
      userCommentLikeRepository,
    });

    await usecase.execute(payload);

    expect(threadCommentRepository.verifyThreadCommentAvailabilty)
      .toBeCalledWith({ threadCommentId: payload.threadCommentId, threadId: payload.threadId });
    expect(userCommentLikeRepository.isUserLikeComment)
      .toBeCalledWith({ threadCommentId: payload.threadCommentId, userId: payload.userId });
    expect(userCommentLikeRepository.removeLike)
      .toBeCalledWith({ threadCommentId: payload.threadCommentId, userId: payload.userId });
  });
});
