const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const DeleteThreadCommentReplyUseCase = require('../../../../Applications/use_case/DeleteThreadCommentReplyUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');
const AddThreadReplyCommentUseCase = require('../../../../Applications/use_case/AddThreadReplyCommentUseCase');
const CreateThread = require('../../../../Domains/threads/entities/CreateThread');
const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    this.deleteThreadCommentReplyHandler = this.deleteThreadCommentReplyHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
    this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
    this.putLikeThreadCommentHandler = this.putLikeThreadCommentHandler.bind(this);
  }

  async postThreadHandler(r, h) {
    const { id: userId } = r.auth.credentials;
    const threadUC = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await threadUC.execute(new CreateThread({
      title: r.payload.title,
      content: r.payload.body,
      userId,
    }));

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentHandler(r, h) {
    const { id: userId } = r.auth.credentials;
    const { threadId } = r.params;
    const { content } = r.payload;

    const threadCommentUC = this._container.getInstance(AddThreadCommentUseCase.name);

    const addedComment = await threadCommentUC.execute({
      userId, threadId, content,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(r, h) {
    const { id: userId } = r.auth.credentials;
    const { threadId, threadCommentId } = r.params;
    const uc = this._container.getInstance(DeleteThreadCommentUseCase.name);
    await uc.execute({
      userId, threadId, threadCommentId,
    });

    return h.response({
      status: 'success',
    });
  }

  async deleteThreadCommentReplyHandler(r, h) {
    const { id: userId } = r.auth.credentials;
    const { threadId, threadCommentId, threadCommentReplyId } = r.params;
    const uc = this._container.getInstance(DeleteThreadCommentReplyUseCase.name);
    await uc.execute({
      userId, threadId, threadCommentId, threadCommentReplyId,
    });

    return h.response({
      status: 'success',
    });
  }

  async getThreadDetailHandler(r, h) {
    const { threadId } = r.params;
    const uc = this._container.getInstance(GetThreadDetailUseCase.name);
    const thread = await uc.execute({ threadId });
    return h.response({
      status: 'success',
      data: {
        thread,
      },
    });
  }

  async postThreadCommentReplyHandler(r, h) {
    const { threadId, commentId } = r.params;
    const { id: userId } = r.auth.credentials;
    const { content } = r.payload;
    const uc = this._container.getInstance(AddThreadReplyCommentUseCase.name);

    const addedReply = await uc.execute({
      userId, threadId, commentId, content,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async putLikeThreadCommentHandler(r, h) {
    const { threadId, commentId } = r.params;
    const { id: userId } = r.auth.credentials;

    const uc = this._container.getInstance(ToggleLikeCommentUseCase.name);

    await uc.execute({ userId, threadId, threadCommentId: commentId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
