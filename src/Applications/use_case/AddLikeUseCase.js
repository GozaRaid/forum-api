const AddLike = require('../../Domains/likes/entities/AddLike');

class AddLikeUseCase {
  constructor({ threadRepository, commentsRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentsRepository = commentsRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
    await this._commentsRepository.verifyAvailabilityComment(useCasePayload.commentId);
    const likeStatus = await this._likeRepository
      .verifyLikeStatus(useCasePayload.commentId, useCasePayload.owner);
    if (likeStatus) {
      await this._likeRepository.deleteLike(useCasePayload.commentId, useCasePayload.owner);
    } else {
      const addLike = new AddLike(useCasePayload);
      await this._likeRepository.addLike(addLike);
    }
  }
}

module.exports = AddLikeUseCase;
