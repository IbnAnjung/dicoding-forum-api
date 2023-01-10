const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const userTest = {
    id: 'user-123',
    username: 'test',
    password: 'secret',
    fullname: 'User Thread Test',
  };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(userTest);
  });

  describe('CreateThread function', () => {
    it('should persist add and return new thread', async () => {
      const createThread = new CreateThread({
        title: 'title',
        content: 'content',
        userId: userTest.id,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const newThread = await threadRepositoryPostgres.createThread(createThread);
      expect(newThread).toStrictEqual(new NewThread({
        id: 'thread-123',
        title: createThread.title,
        owner: createThread.userId,
      }));

      const thread = await ThreadsTableTestHelper.findThreadById(newThread.id);
      expect(thread).toHaveLength(1);
      expect(thread[0].id).toEqual(newThread.id);
      expect(thread[0].title).toEqual(newThread.title);
      expect(thread[0].user_id).toEqual(newThread.owner);
    });
  });

  describe('findThreadById function', () => {
    it('should persist return thread', async () => {
      await ThreadsTableTestHelper.createThread({
        id: 'thread-123',
        title: 'new thread title',
        content: 'thread content',
        userId: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const thread = await threadRepositoryPostgres.findThreadById('thread-123');
      expect(thread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'new thread title',
        content: 'thread content',
        owner: 'user-123',
      }));
    });

    it('should persist return null', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const thread = await threadRepositoryPostgres.findThreadById('thread-123');

      expect(thread).toBeNull();
    });
  });

  describe('getDetailThreadById function', () => {
    it('should presist return detail of thread', async () => {
      await ThreadsTableTestHelper.createThread({
        id: 'thread-123',
        title: 'new thread title',
        content: 'thread content',
        userId: userTest.id,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const thread = await threadRepositoryPostgres.getDetailThreadById('thread-123');
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('new thread title');
      expect(thread.body).toEqual('thread content');
      expect(thread.date).toBeInstanceOf(Date);
      expect(thread.username).toEqual(userTest.username);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should presist return bool is thread available or not', async () => {
      await ThreadsTableTestHelper.createThread({
        id: 'thread-123',
        title: 'new thread title',
        content: 'thread content',
        userId: userTest.id,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const availableThread = await threadRepositoryPostgres.verifyThreadAvailability('thread-123');
      const unavailableThread = await threadRepositoryPostgres.verifyThreadAvailability('unavilable-thread-id');

      expect(availableThread).toEqual(true);
      expect(unavailableThread).toEqual(false);
    });
  });
});
