const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

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
      .mockImplementation(() => Promise.resolve(thread));
    const threadCommentRepository = new ThreadCommentRepository();
    threadCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    threadCommentRepository.getCommentRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(replies));

    const uc = new GetThreadDetailUseCase({
      threadRepository, threadCommentRepository,
    });
    const threadDetail = await uc.execute({ threadId: thread.id });

    expect(threadRepository.getDetailThreadById).toBeCalledWith(thread.id);
    expect(threadCommentRepository.getCommentByThreadId).toBeCalledWith(thread.id);
    expect(threadCommentRepository.getCommentRepliesByCommentIds)
      .toBeCalledWith(comments.map((comment) => comment.id));

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
    expect(threadDetail.comments[1].replies[0].id).toEqual(replies[2].id);
    expect(threadDetail.comments[1].replies[0].username).toEqual(replies[2].username);
    expect(threadDetail.comments[1].replies[0].date).toEqual(replies[2].date);
    expect(threadDetail.comments[1].replies[0].content).toEqual('**balasan telah dihapus**');
  });
});
