const NewThreadComment = require('../NewThreadComment');

describe('a NewThreadComment entities', () => {
  it('should throw error when payload did not neede property', () => {
    const payload = {
      id: 'comment-123',
      content: 'content',
    };

    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data spesification', () => {
    const payload = {
      id: 1,
      content: 'content',
      owner: 'user-1223',
    };

    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'content-comment',
      owner: 'user-2345',
    };

    const newThreadComment = new NewThreadComment(payload);

    expect(newThreadComment.id).toEqual(payload.id);
    expect(newThreadComment.content).toEqual(payload.content);
    expect(newThreadComment.owner).toEqual(payload.owner);
  });
});
