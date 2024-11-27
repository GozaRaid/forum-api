class DeleteReplyUseCase {
  constructor({ replyRepository, commentsRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentsRepository = commentsRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._replyRepository.verifyAvailabilityReply(useCasePayload.replyId);
    await this._commentsRepository.verifyAvailabilityComment(useCasePayload.commentId);
    await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
    await this._replyRepository.verifyReplyOwner(useCasePayload.replyId, useCasePayload.owner);
    await this._replyRepository.deleteReplyById(useCasePayload.replyId);
  }
}

module.exports = DeleteReplyUseCase;
