const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'example contain',
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    const payload = {
      title: true,
      content: {},
      userId: 'user-123',
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateTheread object correctly', () => {
    const payload = {
      title: 'new thread',
      content: 'its timple new thread content',
      userId: 'user-idsdf',
    };

    const createThread = new CreateThread(payload);

    expect(createThread.title).toEqual(payload.title);
    expect(createThread.content).toEqual(payload.content);
    expect(createThread.userId).toEqual(payload.userId);
  });
});
