const ReplysRepository = require('../../../Domains/replys/ReplysRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should organize the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    /** creating dependency of use case */
    const mockReplysRepository = new ReplysRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockReplysRepository.verifyAvailabilityReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplysRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplysRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplysRepository,
      commentsRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplysRepository.verifyAvailabilityReply).toBeCalledWith(useCasePayload.replyId);
    expect(mockCommentsRepository.verifyAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.verifyAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplysRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplysRepository.deleteReplyById).toBeCalledWith(useCasePayload.replyId);
  });
});
