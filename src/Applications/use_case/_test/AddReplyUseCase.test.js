const AddReply = require('../../../Domains/replys/entities/AddReply');
const AddedReply = require('../../../Domains/replys/entities/AddedReply');
const ReplysRepository = require('../../../Domains/replys/ReplysRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
      content: 'reply',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockReplysRepository = new ReplysRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.verifyAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplysRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    // create use case instance
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplysRepository,
      commentsRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: 'reply-123',
        content: mockAddedReply.content,
        owner: mockAddedReply.owner,
      }),
    );
    expect(mockThreadRepository.verifyAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentsRepository.verifyAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockReplysRepository.addReply).toBeCalledWith(new AddReply(useCasePayload));
  });
});
