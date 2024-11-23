class CommentsRepository {
  async AddComment(content) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityComment(commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(commentId, owner) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentById(commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentsRepository;
