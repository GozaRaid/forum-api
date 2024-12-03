const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the comment deletion correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentsRepository.verifyAvailabilityComment = jest.fn(() => Promise.resolve());
    mockThreadRepository.verifyAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentsRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentsRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentsRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentsRepository.verifyAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.verifyAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentsRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentsRepository.deleteCommentById).toBeCalledWith(useCasePayload.commentId);
  });
});
