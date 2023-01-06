const NewThread = require('../NewThread');

describe('a NewThread entity', () => {
  it('should throw error when payload did not contain needed properly', () => {
    const payload = {
      id: 'thread-123',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    const payload = {
      id: 123,
      title: 'new title',
      owner: {},
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create newThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'new thread title',
      owner: 'user-123',
    };

    const { id, title, owner } = new NewThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
