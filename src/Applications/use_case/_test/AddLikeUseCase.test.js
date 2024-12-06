const AddLike = require('../../../Domains/likes/entities/AddLike');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should orchestrate the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const liked = false;

    /** creating dependency of use case */
    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentsRepository.verifyAvailabilityComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeStatus = jest.fn(() => Promise.resolve(liked));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    // create use case instance
    const addLikeUseCase = new AddLikeUseCase({
      commentsRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailabilityThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentsRepository.verifyAvailabilityComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockLikeRepository.verifyLikeStatus).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(new AddLike(useCasePayload));
  });

  it('should orchestrate the delete like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const liked = true;

    /** creating dependency of use case */
    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentsRepository.verifyAvailabilityComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeStatus = jest.fn(() => Promise.resolve(liked));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    // create use case instance
    const addLikeUseCase = new AddLikeUseCase({
      commentsRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailabilityThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentsRepository.verifyAvailabilityComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockLikeRepository.verifyLikeStatus).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
  });
});
