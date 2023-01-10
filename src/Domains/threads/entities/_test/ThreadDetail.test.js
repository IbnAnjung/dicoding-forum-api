const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-1',
      title: 'title',
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    const payloadInvalidOnThread = {
      id: 123,
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [],
    };
    const payloadInvalidOnThreadDate = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: 'wrong date',
      comments: [],
    };
    const payloadInCompleteOnThread = {
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [],
    };

    const payloadInvalidComments = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: {},
    };
    const payloadInCompleteOnCommentObject = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [
        {
          username: 'comment user',
          date: '2022-01-02',
          content: 'content',
          replies: [
            {
              id: 'replies-2',
              username: 'comment user',
              date: '2022-01-02',
              content: '123',
            },
          ],
        },
      ],
    };
    const payloadInvalidOnCommentObject = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [
        {
          id: 123,
          username: 'comment user',
          date: '2022-01-02',
          content: 'content',
          replies: [
            {
              id: 'replies-2',
              username: 'comment user',
              date: '2022-01-02',
              content: '123',
            },
          ],
        },
      ],
    };
    const payloadInvalidOnCommentObjectDate = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [
        {
          id: '123',
          username: 'comment user',
          date: 'wrong date',
          content: 'content',
          replies: [
            {
              id: 'replies-2',
              username: 'comment user',
              date: '2022-01-02',
              content: '123',
            },
          ],
        },
      ],
    };

    const payloadInCompleteOnReplies = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [
        {
          id: 'comment-2',
          username: 'comment user',
          date: '2022-01-02',
          content: 'content',
          replies: [
            {
              username: 'comment user',
              date: '2022-01-02',
              content: 123,
            },
          ],
        },
      ],
    };
    const payloadInvalidOnReplies = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [
        {
          id: 'comment-2',
          username: 'comment user',
          date: '2022-01-02',
          content: 'content',
          replies: [
            {
              id: 1,
              username: 'comment user',
              date: '2022-01-02',
              content: 123,
            },
          ],
        },
      ],
    };
    const payloadInvalidOnRepliesDate = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [
        {
          id: 'comment-2',
          username: 'comment user',
          date: '2022-01-02',
          content: 'content',
          replies: [
            {
              id: '1',
              username: 'comment user',
              date: 'wrong date',
              content: '123',
            },
          ],
        },
      ],
    };
    expect(() => new ThreadDetail(payloadInCompleteOnThread)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadDetail(payloadInvalidOnThread)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payloadInvalidOnThreadDate)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new ThreadDetail(payloadInvalidComments)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payloadInCompleteOnCommentObject)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadDetail(payloadInvalidOnCommentObject)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payloadInvalidOnCommentObjectDate)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new ThreadDetail(payloadInCompleteOnReplies)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadDetail(payloadInvalidOnReplies)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payloadInvalidOnRepliesDate)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateTheread object correctly', () => {
    const replies = [
      {
        id: 'comment-1',
        username: 'comment user',
        date: '2023-01-01T07:22:33.555Z',
        content: 'coment',
      },
    ];

    const comments = [
      {
        id: 'comment-1',
        username: 'comment user',
        date: '2023-01-01T07:22:33.555Z',
        content: 'coment',
        replies,
      },
    ];

    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'thread body',
      username: 'owner thread',
      date: '2023-01-01T07:22:33.555Z',
      comments,
    };

    const thread = new ThreadDetail(payload);

    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.username).toEqual(payload.username);
    expect(thread.date).toEqual(payload.date);
    expect(thread.comments).toStrictEqual(comments);
    expect(thread.comments[0].replies).toStrictEqual(replies);
  });
});
