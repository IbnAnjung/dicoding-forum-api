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
    [1, 2, 3].forEach((id) => {
      comments.push({
        id: `comments-${1}`,
        username: 'saputra',
        date: '2023-01-08T07:19:09.775Z',
        deleted: null,
        content: 'content',
      });
    });

    comments.push({
      id: 'comments-4',
      username: 'saputra',
      date: '2023-01-08T07:19:09.775Z',
      deleted: '2023-01-08T07:19:09.775Z',
      content: 'content',
    });

    const threadRepository = new ThreadRepository();
    threadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    const threadCommentRepository = new ThreadCommentRepository();
    threadCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    const uc = new GetThreadDetailUseCase({
      threadRepository, threadCommentRepository,
    });
    const threadDetail = await uc.execute({ threadId: thread.id });
    thread.comments = comments.map(({ deleted, ...rest }) => rest);

    expect(threadRepository.getDetailThreadById).toBeCalledWith(thread.id);
    expect(threadCommentRepository.getCommentByThreadId).toBeCalledWith(thread.id);
    expect(threadDetail).toStrictEqual(thread);
    expect(threadDetail.comments[3].content).toEqual('**komentar telah dihapus**');
  });
});
