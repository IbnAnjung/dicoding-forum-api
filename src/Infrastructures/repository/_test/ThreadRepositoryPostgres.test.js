const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
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
});
