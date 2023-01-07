const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddNewThreadComment = require('../../../../Domains/threads/entities/AddNewThreadComment');
const CreateThread = require('../../../../Domains/threads/entities/CreateThread');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
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
}

module.exports = ThreadsHandler;
