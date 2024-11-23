class GetDetailThreadById {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    return this._threadRepository.getDetailThreadById(threadId);
  }
}

module.exports = GetDetailThreadById;
