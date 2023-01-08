const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');
const AddThreadReplyCommentUseCase = require('../../../../Applications/use_case/AddThreadReplyCommentUseCase');
const AddNewThreadComment = require('../../../../Domains/threads/entities/AddNewThreadComment');
const CreateThread = require('../../../../Domains/threads/entities/CreateThread');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHanlder = this.deleteThreadCommentHanlder.bind(this);
    this.getThreadDetailHanlder = this.getThreadDetailHanlder.bind(this);
    this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
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

  async deleteThreadCommentHanlder(r, h) {
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

  async getThreadDetailHanlder(r, h) {
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
}

module.exports = ThreadsHandler;
