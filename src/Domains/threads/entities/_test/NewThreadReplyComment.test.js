const NewThreadReplyComment = require('../NewThreadReplyComment');

describe('a NewThreadReplyComment entities', () => {
  it('should throw error when payload did not neede property', () => {
    const payload = {
      id: 'comment-123',
      content: 'content',
    };

    expect(() => new NewThreadReplyComment(payload)).toThrowError('NEW_THREAD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data spesification', () => {
    const payload = {
      id: 1,
      content: 'content',
      owner: 'user-1223',
    };

    expect(() => new NewThreadReplyComment(payload)).toThrowError('NEW_THREAD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadReplyComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'content-comment',
      owner: 'user-2345',
    };

    const newThreadReplyComment = new NewThreadReplyComment(payload);

    expect(newThreadReplyComment.id).toEqual(payload.id);
    expect(newThreadReplyComment.content).toEqual(payload.content);
    expect(newThreadReplyComment.owner).toEqual(payload.owner);
  });
});
