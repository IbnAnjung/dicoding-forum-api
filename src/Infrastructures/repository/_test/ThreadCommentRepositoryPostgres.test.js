const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddNewThreadComment = require('../../../Domains/threads/entities/AddNewThreadComment');
const NewThreadComment = require('../../../Domains/threads/entities/NewThreadComment');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

describe('The ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const userTest = {
    id: 'user-123',
    username: 'test',
    password: 'secret',
    fullname: 'User Thread Test',
  };

  const thread = {
    id: 'thread-123',
    title: 'new thread title',
    content: 'thread content',
    userId: userTest.id,
  };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(userTest);
    await ThreadsTableTestHelper.createThread(thread);
  });

  describe('addNewComment function', () => {
    it('should persist add and return new thread comment', async () => {
      const addNewThreadComment = new AddNewThreadComment({
        content: 'reply comment',
        userId: userTest.id,
        threadId: thread.id,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const repo = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      const newComment = await repo.addNewComment(addNewThreadComment);
      expect(newComment).toStrictEqual(new NewThreadComment({
        id: 'comment-123',
        content: addNewThreadComment.content,
        owner: addNewThreadComment.userId,
      }));

      const comment = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].id).toEqual(newComment.id);
      expect(comment[0].content).toEqual(newComment.content);
      expect(comment[0].owner).toEqual(newComment.user_id);
    });
  });
});
