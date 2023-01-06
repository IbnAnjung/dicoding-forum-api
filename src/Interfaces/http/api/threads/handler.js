const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const CreateThread = require('../../../../Domains/threads/entities/CreateThread');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
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
}

module.exports = ThreadsHandler;
