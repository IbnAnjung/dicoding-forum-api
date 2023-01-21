/* eslint-disable no-await-in-loop */
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
        content: 'comment',
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

  describe('verifyThreadCommentAvailability function', () => {
    it('should not throw error when threadComment is exists', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comment-123',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      });
      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      await expect(repo.verifyThreadCommentAvailabilty({
        threadCommentId: 'comment-123',
        threadId: thread.id,
      })).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFound error when not exists', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comment-123',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      });

      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      await expect(repo.verifyThreadCommentAvailabilty({
        threadCommentId: 'wrong-comment-123',
        threadId: thread.id,
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
      const com = await ThreadCommentsTableTestHelper.findThreadCommentById('comments-123');

      expect(com[0].deleted_at).not.toBeNull();
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should persist get comments by ids', async () => {
      const ids = ['comments-1', 'comments-2'];
      const dates = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const id of ids) {
        dates[id] = new Date();
        await ThreadCommentsTableTestHelper.addNewComment({
          id,
          content: 'content',
          threadId: thread.id,
          userId: userCommentTest.id,
          createdDate: dates[id],
        });
      }

      const deleteDate = new Date();
      ThreadCommentsTableTestHelper.softDeleteThreadCommentById(ids[1], deleteDate);

      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      const comments = await repo.getCommentByThreadId(thread.id);
      expect(comments).toHaveLength(2);

      expect(typeof comments[0]).toBe('object');
      expect(comments[0].id).toEqual('comments-1');
      expect(comments[0].username).toEqual(userCommentTest.username);
      expect(comments[0].date).toBeInstanceOf(Date);
      expect(comments[0].date).toEqual(dates[comments[0].id]);
      expect(comments[0].deleted).toEqual(null);
      expect(comments[0].content).toEqual('content');

      expect(typeof comments[1]).toBe('object');
      expect(comments[1].id).toEqual('comments-2');
      expect(comments[1].username).toEqual(userCommentTest.username);
      expect(comments[1].date).toBeInstanceOf(Date);
      expect(comments[1].date).toEqual(dates[comments[1].id]);
      expect(comments[1].deleted).toBeInstanceOf(Date);
      expect(comments[1].deleted).toEqual(deleteDate);
      expect(comments[1].content).toEqual('content');
    });
  });

  describe('findCommentById function', () => {
    it('should return null when comment not found', async () => {
      const comment = {
        id: 'comment-1',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      };
      await ThreadCommentsTableTestHelper.addNewComment(comment);

      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      const commnet = await repo.findCommentById(`wrong-${comment.id}`);

      expect(commnet).toBeNull();
    });

    it('should return comment when comment is found', async () => {
      const sample = {
        id: 'comment-1',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      };
      await ThreadCommentsTableTestHelper.addNewComment(sample);

      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      const comment = await repo.findCommentById(`${sample.id}`);

      expect(comment).not.toBeNull();
      expect(comment).toStrictEqual({
        id: sample.id,
        content: sample.content,
        threadId: sample.threadId,
        owner: sample.userId,
      });
    });
  });

  describe('increaseLikeComment', () => {
    it('should increase like +=1', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comment-123',
        content: 'conetent',
        threadId: thread.id,
        userId: userTest.id,
        createdDate: new Date(),
      });

      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      await repo.increaseLikeComment('comment-123');
      await repo.increaseLikeComment('comment-123');
      await repo.increaseLikeComment('comment-123');

      const comments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comments[0].like_count).toEqual(3);
    });
  });

  describe('decreaseLikeComment', () => {
    it('should increase like -=1', async () => {
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'comment-123',
        content: 'conetent',
        threadId: thread.id,
        userId: userTest.id,
        createdDate: new Date(),
      });

      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      await repo.increaseLikeComment('comment-123');
      await repo.increaseLikeComment('comment-123');
      await repo.decreaseLikeComment('comment-123');

      const comments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comments[0].like_count).toEqual(1);
    });
  });
});
