const CreateThread = require('../../Domains/threads/entities/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const createThread = new CreateThread(payload);
    return this._threadRepository.createThread(createThread);
  }
}

module.exports = AddThreadUseCase;
