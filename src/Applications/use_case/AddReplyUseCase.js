const AddReply = require('../../Domains/replys/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentsRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentsRepository = commentsRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
    await this._commentsRepository.verifyAvailabilityComment(useCasePayload.commentId);
    const addReply = new AddReply(useCasePayload);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
