const AddNewThreadComment = require('../AddNewThreadComment');

describe('a AddNewThreadComment entities', () => {
  it('should throw error when payload did no contain needed property', () => {
    const payload = {};

    expect(() => new AddNewThreadComment(payload)).toThrowError('CREATE_NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data spesification', () => {
    const payload = {
      content: 123456,
    };

    expect(() => new AddNewThreadComment(payload)).toThrowError('CREATE_NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddNewThreadComment object correctly', () => {
    const payload = {
      content: 'reply',
    };

    const addNewThreadComment = new AddNewThreadComment(payload);
    expect(addNewThreadComment.content).toEqual(payload.content);
  });
});
