const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddCommentsUseCase = require('../AddCommentsUseCase');

describe('AddCommentsUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'comment',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    // create use case instance
    const addCommentsUseCase = new AddCommentsUseCase({
      commentsRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentsUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        owner: mockAddedComment.owner,
        content: mockAddedComment.content,
      }),
    );
    expect(mockThreadRepository.verifyAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentsRepository.addComment).toBeCalledWith(new AddComment(useCasePayload));
  });
});
