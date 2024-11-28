const CommentsRepository = require('../CommentsRepository');

describe('CommentsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentsRepository = new CommentsRepository();

    // Action and Assert
    await expect(commentsRepository.addComment({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentsRepository.verifyAvailabilityComment('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentsRepository.verifyCommentOwner('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentsRepository.deleteCommentById('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentsRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
