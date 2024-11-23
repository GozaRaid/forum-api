const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentsUseCase {
  constructor({ threadRepository, commentsRepository }) {
    this._threadRepository = threadRepository;
    this._commentsRepository = commentsRepository;
  }

  async execute(threadId, owner, content) {
    await this._threadRepository.checkAvailabilityThread(threadId);

    const addComment = new AddComment({ content });

    return this._commentsRepository.addComment(threadId, owner, addComment.content);
  }
}

module.exports = AddCommentsUseCase;
