const AddNewThreadComment = require('../AddNewThreadComment');

describe('a AddNewThreadComment entities', () => {
  it('should throw error when payload did no contain needed property', () => {
    const payload = {
      content: 'content',
      userId: 'user-123',
    };

    expect(() => new AddNewThreadComment(payload)).toThrowError('CREATE_NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data spesification', () => {
    const payload = {
      content: 123456,
      userId: 'user-123',
      threadId: 'thread-234',
    };

    expect(() => new AddNewThreadComment(payload)).toThrowError('CREATE_NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddNewThreadComment object correctly', () => {
    const payload = {
      content: 'reply',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const addNewThreadComment = new AddNewThreadComment(payload);
    expect(addNewThreadComment.content).toEqual(payload.content);
    expect(addNewThreadComment.threadId).toEqual(payload.threadId);
    expect(addNewThreadComment.userId).toEqual(payload.userId);
  });
});
