const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddNewThreadComment = require('../../../Domains/threads/entities/AddNewThreadComment');
const NewThreadComment = require('../../../Domains/threads/entities/NewThreadComment');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('The ThreadCommentRepositoryPostgres', () => {
  const userTest = {
    id: 'user-123',
    username: 'test',
    password: 'secret',
    fullname: 'User Thread Test',
  };

  const userCommentTest = {
    id: 'user-456',
    username: 'comment_test',
    password: 'secret',
    fullname: 'User Thread Test',
  };

  const thread = {
    id: 'thread-123',
    title: 'new thread title',
    content: 'thread content',
    userId: userTest.id,
  };

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser(userTest);
    await UsersTableTestHelper.addUser(userCommentTest);
    await ThreadsTableTestHelper.createThread(thread);
  });

  afterAll(async () => {
    await pool.end();
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

  describe('verifyThreadCommentAndCommentOwner function', () => {
    it('should not throw error when userId is equal to comment owner', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comments-123',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      });
      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      await expect(repo.verifyThreadCommentAndCommentOwner({
        threadCommentId: 'comments-123',
        userId: userCommentTest.id,
      })).resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw Authentication error when userId not equal to comment owner', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comments-123',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      });

      const repo = new ThreadCommentRepositoryPostgres(pool, {});

      await expect(repo.verifyThreadCommentAndCommentOwner({
        threadCommentId: 'comments-123',
        userId: userTest.id,
      })).rejects.toThrowError(AuthorizationError);
    });

    it('should throw NotFound error when userId not equal to comment owner', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comments-123',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      });

      const repo = new ThreadCommentRepositoryPostgres(pool, {});

      await expect(repo.verifyThreadCommentAndCommentOwner({
        threadCommentId: 'another-comments-id',
        userId: userTest.id,
      })).rejects.toThrowError(NotFoundError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist soft deleted comment by fill deleted_at', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comments-123',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      });

      const repo = new ThreadCommentRepositoryPostgres(pool);
      await repo.deleteCommentById('comments-123');
      const res = await ThreadCommentsTableTestHelper.findThreadCommentById('comments-123');
      const comment = res[0];

      expect(comment.deleted_at).not.toBeNull();
    });
  });
});
