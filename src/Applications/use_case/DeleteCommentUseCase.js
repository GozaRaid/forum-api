class DeleteCommentUseCase {
  constructor({ commentsRepository, threadRepository }) {
    this._commentsRepository = commentsRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
    await this._commentsRepository.verifyAvailabilityComment(useCasePayload.commentId);
    await this._commentsRepository.verifyCommentOwner(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    await this._commentsRepository.deleteCommentById(useCasePayload.commentId);
  }
}

module.exports = DeleteCommentUseCase;
