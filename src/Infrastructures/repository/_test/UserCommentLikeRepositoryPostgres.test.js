const UserCommentLikesTableTestHelper = require('../../../../tests/UserCommentLikesTableTestHelper');
const UserCommentLikeRepositoryPostgres = require('../UserCommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('UseCommentLikeRepositoryPostgres', () => {
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
    userId: userCommentTest.id,
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

  describe('isUserLikeComment function()', () => {
    it('should return false if user not like the comment', async () => {
      await UserCommentLikesTableTestHelper.addLike({
        userId: userTest.id,
        threadCommentId: comment1.id,
      });

      const repo = new UserCommentLikeRepositoryPostgres(pool);

      const isUserLikeComment = await repo.isUserLikeComment({
        threadCommentId: comment1.id,
        userId: userCommentTest.id,
      });

      expect(isUserLikeComment).toEqual(false);
    });

    it('should return true if user already like the comment', async () => {
      await UserCommentLikesTableTestHelper.addLike({
        userId: userTest.id,
        threadCommentId: comment1.id,
      });

      const repo = new UserCommentLikeRepositoryPostgres(pool);

      const isUserLikeComment = await repo.isUserLikeComment({
        threadCommentId: comment1.id,
        userId: userTest.id,
      });

      expect(isUserLikeComment).toEqual(true);
    });
  });

  describe('addLike function()', () => {
    it('should add new user comments like', async () => {
      const repo = new UserCommentLikeRepositoryPostgres(pool);

      await repo.addLike({
        threadCommentId: comment1.id,
        userId: userCommentTest.id,
      });

      await repo.addLike({
        threadCommentId: comment1.id,
        userId: userCommentTest.id,
      });

      const res = await UserCommentLikesTableTestHelper.getUserCommentLike(comment1.id);

      expect(res.length).toEqual(2);
    });
  });

  describe('removeLike function()', () => {
    it('should add remove user comments like', async () => {
      await UserCommentLikesTableTestHelper.addLike({
        userId: userTest.id,
        threadCommentId: comment1.id,
      });

      await UserCommentLikesTableTestHelper.addLike({
        userId: userCommentTest.id,
        threadCommentId: comment1.id,
      });

      const repo = new UserCommentLikeRepositoryPostgres(pool);

      await repo.removeLike({
        threadCommentId: comment1.id,
        userId: userCommentTest.id,
      });

      const res = await UserCommentLikesTableTestHelper.getUserCommentLike(comment1.id);
      expect(res.length).toEqual(1);

      const userLike = await UserCommentLikesTableTestHelper.findUserCommentLike({
        userId: userCommentTest.id,
        threadCommentId: comment1.id,
      });
      expect(userLike.length).toEqual(0);
    });
  });
});
