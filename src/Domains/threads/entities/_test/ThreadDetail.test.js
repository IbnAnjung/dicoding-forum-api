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
    const payload = {
      id: '123',
      title: 'title',
      body: 'thread body',
      username: 'angga',
      date: '2022-01-02',
      comments: [
        {
          id: 'comment-1',
          username: 'comment user',
          date: 'worng date',
          content: 'coment',
        },
      ],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateTheread object correctly', () => {
    const comments = [
      {
        id: 'comment-1',
        username: 'comment user',
        date: '2023-01-01T07:22:33.555Z',
        content: 'coment',
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
  });
});
