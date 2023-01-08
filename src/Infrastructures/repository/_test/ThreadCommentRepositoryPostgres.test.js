/* eslint-disable no-await-in-loop */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddNewThreadComment = require('../../../Domains/threads/entities/AddNewThreadComment');
const AddNewThreadReplyComment = require('../../../Domains/threads/entities/AddNewThreadReplyComment');
const NewThreadComment = require('../../../Domains/threads/entities/NewThreadComment');
const NewThreadReplyComment = require('../../../Domains/threads/entities/NewThreadReplyComment');
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

  describe('getCommentByThreadId function', () => {
    it('should persist get comments by ids', async () => {
      const ids = ['comments-1', 'comments-2', 'comments-3'];
      // eslint-disable-next-line no-restricted-syntax
      for (const id of ids) {
        await ThreadCommentsTableTestHelper.addNewComment({
          id,
          content: 'content',
          threadId: thread.id,
          userId: userCommentTest.id,
        });
      }

      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'reply-1',
        commentParentId: 'comments-1',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      });

      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      const comments = await repo.getCommentByThreadId(thread.id);
      expect(comments).toHaveLength(3);
      const resIds = comments.map(({ id }) => id);
      expect(resIds).toStrictEqual(ids);
    });
  });

  describe('addNewReplyComment function', () => {
    it('should add new reply comment', async () => {
      const comment = {
        id: 'reply-1',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      };
      await ThreadCommentsTableTestHelper.addNewComment(comment);
      const payload = new AddNewThreadReplyComment({
        content: 'reply content',
        userId: userTest.id,
        threadId: thread.id,
        commentId: comment.id,
      });

      const idGenerator = () => '111';
      const repo = new ThreadCommentRepositoryPostgres(pool, idGenerator);
      const newThreadReplyComment = await repo.addNewReplyComment(payload);

      const replies = await ThreadCommentsTableTestHelper
        .getThreadReplyCommentByCommentId(comment.id);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toBeDefined();
      expect(replies[0].content).toEqual(payload.content);
      expect(replies[0].owner).toEqual(payload.user_id);
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

  describe('getCommentRepliesByCommentIds function', () => {
    it('should return all comment replies', async () => {
      const comment = {
        id: 'comment-1',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      };
      const comment2 = {
        id: 'comment-2',
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      };

      await ThreadCommentsTableTestHelper.addNewComment(comment);
      await ThreadCommentsTableTestHelper.addNewComment(comment2);

      const replies1 = {
        id: 'replies-1',
        commentParentId: comment.id,
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      };
      const replies2 = {
        id: 'replies-2',
        commentParentId: comment2.id,
        content: 'content',
        threadId: thread.id,
        userId: userCommentTest.id,
      };

      await ThreadCommentsTableTestHelper.addNewComment(replies1);
      await ThreadCommentsTableTestHelper.addNewComment(replies2);
      const repo = new ThreadCommentRepositoryPostgres(pool, {});
      const res = await repo
        .getCommentRepliesByCommentIds([replies1.commentParentId, replies2.commentParentId]);

      expect(res).toHaveLength(2);
      expect(res[0].id).toEqual(replies1.id);
      expect(res[1].id).toEqual(replies2.id);
    });
  });
});
