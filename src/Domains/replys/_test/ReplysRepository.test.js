const ReplysRepository = require('../ReplysRepository');

describe('ReplysRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replysRepository = new ReplysRepository();

    // Action and Assert
    await expect(replysRepository.addReply({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replysRepository.verifyAvailabilityReply('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replysRepository.verifyReplyOwner('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replysRepository.deleteReplyById('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replysRepository.getAllReplies('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
