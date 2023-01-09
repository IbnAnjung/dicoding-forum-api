const AddNewThreadCommentReply = require('../AddNewThreadCommentReply');

describe('a AddNewThreadCommentReply entities', () => {
  it('should throw error when payload did no contain needed property', () => {
    const payload = {
      content: 'content',
      userId: 'user-123',
    };

    expect(() => new AddNewThreadCommentReply(payload)).toThrowError('ADD_NEW_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data spesification', () => {
    const payload = {
      content: 123456,
      userId: 'user-123',
      threadId: 'thread-234',
      commentId: 'comment-123',
    };

    expect(() => new AddNewThreadCommentReply(payload)).toThrowError('ADD_NEW_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddNewThreadCommentReply object correctly', () => {
    const payload = {
      content: 'reply',
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const addNewThreadCommentReply = new AddNewThreadCommentReply(payload);
    expect(addNewThreadCommentReply.content).toEqual(payload.content);
    expect(addNewThreadCommentReply.threadId).toEqual(payload.threadId);
    expect(addNewThreadCommentReply.userId).toEqual(payload.userId);
    expect(addNewThreadCommentReply.commentId).toEqual(payload.commentId);
  });
});
