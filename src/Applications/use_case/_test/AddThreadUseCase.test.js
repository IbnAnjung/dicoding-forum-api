const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const createThread = {
      title: 'title',
      content: 'new thread content',
      userId: 'user-123',
    };

    const thread = new NewThread({
      id: 'thread-123',
      title: createThread.title,
      owner: createThread.userId,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.createThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    const newThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await newThreadUseCase.execute(createThread);

    expect(mockThreadRepository.createThread).toBeCalledWith(createThread);
    expect(addedThread).toStrictEqual(thread);
  });
});