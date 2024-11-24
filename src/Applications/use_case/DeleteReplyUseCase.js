class DeleteReplyUseCase {
  constructor({ replyRepository, commentsRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentsRepository = commentsRepository;
    this._threadRepository = threadRepository;
  }

  async execute(replyId, commentId, owner, threadId) {
    await this._replyRepository.verifyAvailabilityReply(replyId);
    await this._commentsRepository.verifyAvailabilityComment(commentId);
    await this._threadRepository.verifyAvailabilityThread(threadId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
