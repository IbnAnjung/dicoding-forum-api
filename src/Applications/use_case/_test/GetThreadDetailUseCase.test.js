const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const UserCommentLikeRepository = require('../../../Domains/users/UserCommentLikeRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get detail thread correctly', async () => {
    const thread = {
      id: 'thread-1',
      title: 'title',
      body: 'body',
      date: '2023-01-08T07:19:09.775Z',
      username: 'angga',
    };

    const comments = [];
    [1].forEach((id) => {
      comments.push({
        id: `comments-${id}`,
        username: 'saputra',
        date: '2023-01-08T07:19:09.775Z',
        deleted: null,
        content: 'content',
      });
    });

    comments.push({
      id: 'comments-2',
      username: 'saputra',
      date: '2023-01-08T07:19:09.775Z',
      deleted: '2023-01-08T07:19:09.775Z',
      content: 'content',
    });

    const replies = [];
    [1, 2].forEach((id) => {
      const reply = {
        id: `replies-${id}`,
        comment: 'comments-1',
        username: 'saputra',
        date: '2023-01-08T07:19:09.775Z',
        deleted: null,
        content: 'content',
      };
      replies.push(reply);
    });

    const deletedReply = {
      id: 'replies-3',
      comment: 'comments-2',
      username: 'saputra',
      date: '2023-01-08T07:19:09.775Z',
      deleted: '2023-01-08T07:19:09.775Z',
      content: 'content',
    };
    replies.push(deletedReply);

    const threadRepository = new ThreadRepository();
    threadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        date: '2023-01-08T07:19:09.775Z',
        username: 'angga',
      }));
    const threadCommentRepository = new ThreadCommentRepository();
    threadCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comments-1',
          username: 'saputra',
          date: '2023-01-08T07:19:09.775Z',
          deleted: null,
          content: 'content',
        },
        {
          id: 'comments-2',
          username: 'saputra',
          date: '2023-01-08T07:19:09.775Z',
          deleted: '2023-01-08T07:19:09.775Z',
          content: 'content',
        },
      ]));
    const threadCommentReplyRepository = new ThreadCommentReplyRepository();
    threadCommentReplyRepository.getCommentRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'replies-1',
          comment_id: 'comments-1',
          username: 'saputra',
          created_at: '2023-01-08T07:19:09.775Z',
          deleted: null,
          content: 'content',
        },
        {
          id: 'replies-2',
          comment_id: 'comments-1',
          username: 'saputra',
          created_at: '2023-01-08T07:19:09.775Z',
          deleted: null,
          content: 'content',
        },
        {
          id: 'replies-3',
          comment_id: 'comments-2',
          username: 'saputra',
          created_at: '2023-01-08T07:19:09.775Z',
          deleted: '2023-01-08T07:19:09.775Z',
          content: 'content',
        },
      ]));

    const userCommentLikeRepository = new UserCommentLikeRepository();
    userCommentLikeRepository.countLikeByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          comment_id: 'comments-1',
          total_like: 2,
        },
      ]));

    const uc = new GetThreadDetailUseCase({
      threadRepository,
      threadCommentRepository,
      threadCommentReplyRepository,
      userCommentLikeRepository,
    });
    const threadDetail = await uc.execute({ threadId: thread.id });
    const commentIds = comments.map((comment) => comment.id);
    expect(threadRepository.getDetailThreadById).toBeCalledWith(thread.id);
    expect(threadCommentRepository.getCommentByThreadId).toBeCalledWith(thread.id);
    expect(threadCommentReplyRepository.getCommentRepliesByCommentIds)
      .toBeCalledWith(commentIds);
    expect(userCommentLikeRepository.countLikeByCommentIds)
      .toBeCalledWith(commentIds);

    expect(threadDetail.id).toEqual(thread.id);
    expect(threadDetail.title).toEqual(thread.title);
    expect(threadDetail.body).toEqual(thread.body);
    expect(threadDetail.date).toEqual(thread.date);
    expect(threadDetail.username).toEqual(thread.username);

    expect(threadDetail.comments).toHaveLength(2);
    expect(threadDetail.comments[0].id).toEqual(comments[0].id);
    expect(threadDetail.comments[0].username).toEqual(comments[0].username);
    expect(threadDetail.comments[0].date).toEqual(comments[0].date);
    expect(threadDetail.comments[0].content).toEqual(comments[0].content);
    expect(threadDetail.comments[0].likeCount).toEqual(2);
    expect(threadDetail.comments[0].replies).toHaveLength(2);
    expect(threadDetail.comments[0].replies[0].id).toEqual(replies[0].id);
    expect(threadDetail.comments[0].replies[0].username).toEqual(replies[0].username);
    expect(threadDetail.comments[0].replies[0].date).toEqual(replies[0].date);
    expect(threadDetail.comments[0].replies[0].content).toEqual(replies[0].content);
    expect(threadDetail.comments[0].replies[1].id).toEqual(replies[1].id);
    expect(threadDetail.comments[0].replies[1].username).toEqual(replies[1].username);
    expect(threadDetail.comments[0].replies[1].date).toEqual(replies[1].date);
    expect(threadDetail.comments[0].replies[1].content).toEqual(replies[1].content);
    expect(threadDetail.comments[1].replies).toHaveLength(1);
    expect(threadDetail.comments[1].id).toEqual(comments[1].id);
    expect(threadDetail.comments[1].username).toEqual(comments[1].username);
    expect(threadDetail.comments[1].date).toEqual(comments[1].date);
    expect(threadDetail.comments[1].content).toEqual('**komentar telah dihapus**');
    expect(threadDetail.comments[1].likeCount).toEqual(0);
    expect(threadDetail.comments[1].replies[0].id).toEqual(replies[2].id);
    expect(threadDetail.comments[1].replies[0].username).toEqual(replies[2].username);
    expect(threadDetail.comments[1].replies[0].date).toEqual(replies[2].date);
    expect(threadDetail.comments[1].replies[0].content).toEqual('**balasan telah dihapus**');
  });

  it('should show error when thread not found', async () => {
    const thread = {
      id: 'thread-1',
      title: 'title',
      body: 'body',
      date: '2023-01-08T07:19:09.775Z',
      username: 'angga',
    };

    const threadRepository = new ThreadRepository();
    threadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));
    const threadCommentRepository = new ThreadCommentRepository();

    const uc = new GetThreadDetailUseCase({
      threadRepository, threadCommentRepository,
    });
    await expect(uc.execute({ threadId: thread.id }))
      .rejects.toThrowError('THREAD_DETAIL.THREAD_NOT_FOUND');
  });
});
