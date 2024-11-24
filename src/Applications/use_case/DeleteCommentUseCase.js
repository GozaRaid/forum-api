class DeleteCommentUseCase {
  constructor({ commentsRepository, threadRepository }) {
    this._commentsRepository = commentsRepository;
    this._threadRepository = threadRepository;
  }

  async execute(commentId, owner, threadId) {
    await this._commentsRepository.verifyAvailabilityComment(commentId);
    await this._threadRepository.verifyAvailabilityThread(threadId);
    await this._commentsRepository.verifyCommentOwner(commentId, owner);
    await this._commentsRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
