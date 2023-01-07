const Jwt = require('@hapi/jwt');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const JwtTokenManager = require('../../security/JwtTokenManager');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  const user = {
    id: 'user-123', username: 'angga', password: '123', fullname: 'angga saputra',
  };

  const commentUser = {
    id: 'user-456', username: 'comment', password: '123', fullname: 'angga saputra',
  };

  const thread = {
    id: 'thread-123',
    title: 'title',
    content: 'content',
    userId: 'user-123',
  };

  const comment = {
    id: 'comment-id',
    userId: commentUser.id,
    threadId: thread.id,
    content: 'content',
  };

  describe('when POST /threads', () => {
    it('should response 201 and create new thread', async () => {
      await UsersTableTestHelper.addUser(user);

      const requestPayload = {
        title: 'new title',
        body: 'thread body',
      };

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(user);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(typeof responseJson.data.addedThread.id).toBe('string');
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.addedThread.owner).toEqual(user.id);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      await UsersTableTestHelper.addUser(user);
      const requestPayload = {
        title: 'new title',
      };

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(user);

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru, karena properti yang di butuhkan tidak ada');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and crate new comment on thread', async () => {
      await UsersTableTestHelper.addUser(user);

      const req = {
        content: 'comment',
      };

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(user);

      await ThreadsTableTestHelper.createThread(thread);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: req,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data).toBeDefined();
      expect(responseJSON.data.addedComment).toBeDefined();
      expect(typeof responseJSON.data.addedComment.id).toBe('string');
      expect(responseJSON.data.addedComment.content).toBe(req.content);
      expect(responseJSON.data.addedComment.owner).toBe(user.id);
    });

    it('should response 404 when thread not found', async () => {
      await UsersTableTestHelper.addUser(user);

      const req = {
        content: 'comment',
      };

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(user);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: req,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(typeof responseJSON.message).toBe('string');
    });

    it('should response 400 when payload not contain needed property', async () => {
      await UsersTableTestHelper.addUser(user);

      const req = {};

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(user);

      await ThreadsTableTestHelper.createThread(thread);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: req,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(typeof responseJSON.message).toBe('string');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{threadCommentId}', () => {
    it('should response 404 when thread not found', async () => {
      await UsersTableTestHelper.addUser(user);
      await UsersTableTestHelper.addUser(commentUser);
      await ThreadsTableTestHelper.createThread(thread);
      await ThreadCommentsTableTestHelper.addNewComment(comment);

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(commentUser);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/another-user-id/comments/${comment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(typeof responseJSON.message).toBe('string');
    });

    it('should response 404 when comment not found', async () => {
      await UsersTableTestHelper.addUser(user);
      await UsersTableTestHelper.addUser(commentUser);
      await ThreadsTableTestHelper.createThread(thread);
      await ThreadCommentsTableTestHelper.addNewComment(comment);

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(commentUser);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/another-comment-id`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(typeof responseJSON.message).toBe('string');
    });

    it('should response 403 when not owner user', async () => {
      await UsersTableTestHelper.addUser(user);
      await UsersTableTestHelper.addUser(commentUser);
      await ThreadsTableTestHelper.createThread(thread);
      await ThreadCommentsTableTestHelper.addNewComment(comment);

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(user);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJSON.status).toEqual('fail');
      expect(typeof responseJSON.message).toBe('string');
    });

    it('should response 200 when request is good', async () => {
      await UsersTableTestHelper.addUser(user);
      await UsersTableTestHelper.addUser(commentUser);
      await ThreadsTableTestHelper.createThread(thread);
      await ThreadCommentsTableTestHelper.addNewComment(comment);

      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(commentUser);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when thread not found', async () => {
      await UsersTableTestHelper.addUser(user);
      await UsersTableTestHelper.addUser(commentUser);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread.id}_345`,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(typeof responseJSON.message).toBe('string');
    });

    it('should response 200 with correct detail', async () => {
      await UsersTableTestHelper.addUser(user);
      await UsersTableTestHelper.addUser(commentUser);

      await ThreadsTableTestHelper.createThread(thread);
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'commnet-2',
        content: 'comment',
        threadId: thread.id,
        userId: commentUser.id,
      });
      await ThreadCommentsTableTestHelper.addNewComment({
        id: 'commnet-1',
        content: 'comment',
        threadId: thread.id,
        userId: user.id,
      });

      await ThreadCommentsTableTestHelper.softDeleteThreadCommentById('commnet-1');

      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread.id}`,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data.thread).toBeDefined();

      const resThread = responseJSON.data.thread;
      expect(resThread.id).toEqual(thread.id);
      expect(resThread.title).toEqual(thread.title);
      expect(resThread.body).toEqual(thread.content);
      expect(typeof resThread.date).toBe('string');
      expect(resThread.username).toEqual(user.username);

      const comment1 = resThread.comments[0];
      expect(comment1.id).toEqual('commnet-2');
      expect(comment1.username).toEqual(commentUser.username);
      expect(typeof comment1.date).toBe('string');
      expect(comment1.content).toBe('comment');

      const comment2 = resThread.comments[1];
      expect(comment2.id).toEqual('commnet-1');
      expect(comment2.username).toEqual(user.username);
      expect(typeof comment2.date).toBe('string');
      expect(comment2.content).toBe('**komentar telah dihapus**');
    });
  });
});
