/* eslint-disable no-await-in-loop */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddNewThreadCommentReply = require('../../../Domains/threads/entities/AddNewThreadCommentReply');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('The ThreadCommentReplyRepositoryPostgres', () => {
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

  const comment1 = {
    id: 'comment-1',
    content: 'comment',
    userId: userTest.id,
  };

  const comment2 = {
    id: 'comment-2',
    content: 'comment',
    userId: userTest.id,
  };

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser(userTest);
    await UsersTableTestHelper.addUser(userCommentTest);
    await ThreadsTableTestHelper.createThread(thread);
    await ThreadCommentsTableTestHelper.addNewComment(comment1);
    await ThreadCommentsTableTestHelper.addNewComment(comment2);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addNewReplyComment function', () => {
    it('should add new reply comment', async () => {
      const payload = new AddNewThreadCommentReply({
        content: 'reply content',
        userId: userTest.id,
        threadId: thread.id,
        commentId: comment1.id,
      });

      const idGenerator = () => '111';
      const repo = new ThreadCommentReplyRepositoryPostgres(pool, idGenerator);

      await repo.addNewReplyComment(payload);

      const replies = await ThreadCommentRepliesTableTestHelper
        .getThreadReplyCommentByCommentId(comment1.id);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toBeDefined();
      expect(replies[0].id).toEqual('reply-111');
      expect(replies[0].content).toEqual(payload.content);
      expect(replies[0].user_id).toEqual(payload.userId);
      expect(replies[0].thread_comment_id).toEqual(payload.commentId);
    });
  });

  describe('verifyThreadCommentReplyAndCommentReplyOwner function', () => {
    it('should not throw error when userId is exists and equal to comment owner', async () => {
      await ThreadCommentRepliesTableTestHelper.addNewCommentReply({
        id: 'reply-123',
        content: 'content',
        userId: userCommentTest.id,
        threadCommentId: comment1.id,
      });
      const repo = new ThreadCommentReplyRepositoryPostgres(pool, {});
      await expect(repo.verifyThreadCommentReplyAndCommentReplyOwner({
        threadCommentId: comment1.id,
        replyId: 'reply-123',
        userId: userCommentTest.id,
      })).resolves.not.toThrowError(NotFoundError);
      await expect(repo.verifyThreadCommentReplyAndCommentReplyOwner({
        threadCommentId: comment1.id,
        replyId: 'reply-123',
        userId: userCommentTest.id,
      })).resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw Authentication error when userId not equal to reply owner', async () => {
      await ThreadCommentRepliesTableTestHelper.addNewCommentReply({
        id: 'reply-123',
        content: 'content',
        userId: userCommentTest.id,
        threadCommentId: comment1.id,
      });

      const repo = new ThreadCommentReplyRepositoryPostgres(pool, {});

      await expect(repo.verifyThreadCommentReplyAndCommentReplyOwner({
        threadCommentId: comment1.id,
        userId: userTest.id,
        replyId: 'reply-123',
      })).rejects.toThrowError(AuthorizationError);
    });

    it('should throw NotFound error when not exists', async () => {
      await ThreadCommentRepliesTableTestHelper.addNewCommentReply({
        id: 'reply-123',
        content: 'content',
        userId: userCommentTest.id,
        threadCommentId: comment1.id,
      });

      const repo = new ThreadCommentReplyRepositoryPostgres(pool, {});

      await expect(repo.verifyThreadCommentReplyAndCommentReplyOwner({
        threadCommentId: comment1.id,
        userId: userTest.id,
        replyId: 'reply-123-wrong',
      })).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getCommentRepliesByCommentIds function', () => {
    it('should return all comment replies', async () => {
      const replies1Date = new Date();
      const replies1 = {
        id: 'replies-1',
        threadCommentId: comment1.id,
        content: 'content',
        userId: userCommentTest.id,
        createdDate: replies1Date,
      };

      await ThreadCommentRepliesTableTestHelper.addNewCommentReply(replies1);

      const replies2Date = new Date();
      const replies2 = {
        id: 'replies-2',
        threadCommentId: comment2.id,
        content: 'content',
        userId: userCommentTest.id,
        createdDate: replies2Date,
      };
      await ThreadCommentRepliesTableTestHelper.addNewCommentReply(replies2);
      const replies2DeletedDate = new Date();
      await ThreadCommentRepliesTableTestHelper
        .softDeleteThreadCommentById(replies2.id, replies2DeletedDate);

      const repo = new ThreadCommentReplyRepositoryPostgres(pool, {});
      const res = await repo
        .getCommentRepliesByCommentIds([replies1.threadCommentId, replies2.threadCommentId]);
      expect(res).toHaveLength(2);
      expect(res[0].id).toEqual(replies1.id);
      expect(res[0].content).toEqual(replies1.content);
      expect(res[0].username).toEqual(userCommentTest.username);
      expect(res[0].comment).toEqual(replies1.threadCommentId);
      expect(res[0].date).toEqual(replies1.createdDate);
      expect(res[0].deleted).toBeNull();

      expect(res[1].id).toEqual(replies2.id);
      expect(res[1].content).toEqual(replies2.content);
      expect(res[1].username).toEqual(userCommentTest.username);
      expect(res[1].comment).toEqual(replies2.threadCommentId);
      expect(res[1].date).toEqual(replies2.createdDate);
      expect(res[1].deleted).toEqual(replies2DeletedDate);
    });
  });

  describe('deleteCommentReplyById function', () => {
    it('should persist soft deleted comment by fill deleted_at', async () => {
      const replies1 = {
        id: 'replies-1',
        commentParentId: comment1.id,
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

      await ThreadCommentRepliesTableTestHelper.addNewCommentReply(replies1);
      await ThreadCommentRepliesTableTestHelper.addNewCommentReply(replies2);

      const repo = new ThreadCommentReplyRepositoryPostgres(pool);
      await repo.deleteCommentReplyById(replies1.id);

      const resReply1 = await ThreadCommentRepliesTableTestHelper
        .findThreadCommentReplyById(replies1.id);
      const resReply2 = await ThreadCommentRepliesTableTestHelper
        .findThreadCommentReplyById(replies2.id);

      expect(resReply1[0].deleted_at).not.toBeNull();
      expect(resReply2[0].deleted_at).toBeNull();
    });
  });
});
