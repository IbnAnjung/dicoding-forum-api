const AddNewThreadReplyComment = require('../AddNewThreadReplyComment');

describe('a AddNewThreadReplyComment entities', () => {
  it('should throw error when payload did no contain needed property', () => {
    const payload = {
      content: 'content',
      userId: 'user-123',
    };

    expect(() => new AddNewThreadReplyComment(payload)).toThrowError('ADD_NEW_THREAD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data spesification', () => {
    const payload = {
      content: 123456,
      userId: 'user-123',
      threadId: 'thread-234',
      commentId: 'comment-123',
    };

    expect(() => new AddNewThreadReplyComment(payload)).toThrowError('ADD_NEW_THREAD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddNewThreadReplyComment object correctly', () => {
    const payload = {
      content: 'reply',
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const addNewThreadReplyComment = new AddNewThreadReplyComment(payload);
    expect(addNewThreadReplyComment.content).toEqual(payload.content);
    expect(addNewThreadReplyComment.threadId).toEqual(payload.threadId);
    expect(addNewThreadReplyComment.userId).toEqual(payload.userId);
    expect(addNewThreadReplyComment.commentId).toEqual(payload.commentId);
  });
});
