const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'example contain',
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    const payload = {
      id: 123,
      title: true,
      content: {},
      owner: 'user-123',
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateTheread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'new thread',
      content: 'its timple new thread content',
      owner: 'user-idsdf',
    };

    const thread = new Thread(payload);

    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.content).toEqual(payload.content);
    expect(thread.owner).toEqual(payload.owner);
  });
});
