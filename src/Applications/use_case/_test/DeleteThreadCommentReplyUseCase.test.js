const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const DeleteThreadCommentReplyUseCase = require('../DeleteThreadCommentReplyUseCase');

describe('DeleteThreadCommentReplyUseCase', () => {
  it('should orchestratin the delete comment yser action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comments-123';
    const threadCommentReplyId = 'reply-123';

    const thread = new NewThread({
      id: threadId,
      title: 'title',
      owner: 'user-thread-owner',
    });
    const threadRepository = new ThreadRepository();
    threadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    const threadCommentRepository = new ThreadCommentRepository();
    threadCommentRepository.verifyThreadCommentReplyAndCommentReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    threadCommentRepository.deleteCommentReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const useCase = new DeleteThreadCommentReplyUseCase({
      threadRepository, threadCommentRepository,
    });

    await useCase.execute({
      threadId,
      userId,
      threadCommentId,
      threadCommentReplyId,
    });

    expect(threadRepository.findThreadById).toBeCalledWith(threadId);
    expect(threadCommentRepository.verifyThreadCommentReplyAndCommentReplyOwner).toBeCalledWith({
      userId,
      threadCommentId,
      replyId: threadCommentReplyId,
    });
    expect(threadCommentRepository.deleteCommentReplyById).toBeCalledWith(threadCommentReplyId);
  });
});
