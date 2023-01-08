const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postThreadCommentReplyHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{threadCommentId}',
    handler: handler.deleteThreadCommentHanlder,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadDetailHanlder,
  },
]);

module.exports = routes;
