const AddReply = require('../../Domains/replys/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentsRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentsRepository = commentsRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, owner, content) {
    await this._threadRepository.verifyAvailabilityThread(threadId);
    await this._commentsRepository.verifyAvailabilityComment(commentId);
    const addReply = new AddReply({ content });
    return this._replyRepository.addReply(commentId, owner, addReply.content);
  }
}

module.exports = AddReplyUseCase;
