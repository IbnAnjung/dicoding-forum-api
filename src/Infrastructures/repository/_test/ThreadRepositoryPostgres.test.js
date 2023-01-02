const ThreadTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableHelper.cleanTable();
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
      const newThread = new CreateThread({
        id: 'thread-123',
        title: 'title',
        content: 'content',
        userId: userTest.id,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await threadRepositoryPostgres.createThread(newThread);

      const thread = await ThreadTableHelper.findThreadById(newThread.id);

      expect(thread).toHaveLength(1);
      expect(thread[0].id).toEqual(newThread.id);
      expect(thread[0].title).toEqual(newThread.title);
      expect(thread[0].content).toEqual(newThread.content);
      expect(thread[0].user_id).toEqual(newThread.userId);
    });
  });
});
