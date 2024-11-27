const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentsUseCase {
  constructor({ threadRepository, commentsRepository }) {
    this._threadRepository = threadRepository;
    this._commentsRepository = commentsRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
    const addComment = new AddComment(useCasePayload);
    return this._commentsRepository.addComment(addComment);
  }
}

module.exports = AddCommentsUseCase;
