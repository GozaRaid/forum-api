const ReplysRepository = require('../../../Domains/replys/ReplysRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetDetailThreadById = require('../GetDetailThreadByIdUseCase');

describe('GetDetailThreadById', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    // Mock repositories
    const mockThreadRepository = new ThreadRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockReplysRepository = new ReplysRepository();
    const mockLikeRepository = new LikeRepository();

    // Mock thread detail
    const mockThread = {
      id: 'thread-123',
      title: 'Test Thread',
      body: 'Thread body',
      date: '2023-01-01',
      username: 'johndoe',
    };

    // Mock comments
    const mockComments = [
      {
        id: 'comment-123',
        username: 'jane',
        date: '2023-01-02',
        content: 'First comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'john',
        date: '2023-01-03',
        content: 'Second comment',
        is_delete: true,
      },
    ];

    // Mock replies
    const mockReplies = [
      {
        id: 'reply-123',
        username: 'jack',
        date: '2023-01-04',
        content: 'First reply',
        is_delete: false,
      },
      {
        id: 'reply-456',
        username: 'jill',
        date: '2023-01-05',
        content: 'Second reply',
        is_delete: true,
      },
    ];

    const mockLikes = [
      { comment_id: 'comment-123' },
      { comment_id: 'comment-123' },
      { comment_id: 'comment-456' },
    ];

    // Mocking repository methods
    mockThreadRepository.verifyAvailabilityThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest.fn(() => Promise.resolve(mockThread));
    mockCommentsRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
    mockReplysRepository.getAllReplies = jest.fn(() => Promise.resolve(mockReplies));
    mockLikeRepository.getAllLikes = jest.fn((commentId) => Promise
      .resolve(mockLikes.filter((like) => like.comment_id === commentId).length));

    // Create use case instance
    const getDetailThreadByIdUseCase = new GetDetailThreadById({
      threadRepository: mockThreadRepository,
      commentsRepository: mockCommentsRepository,
      replyRepository: mockReplysRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailedThread = await getDetailThreadByIdUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailabilityThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getDetailThreadById)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentsRepository.getCommentsByThreadId)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockReplysRepository.getAllReplies)
      .toHaveBeenCalledTimes(mockComments.length);
    expect(mockLikeRepository.getAllLikes)
      .toHaveBeenCalledTimes(mockComments.length);

    // Verify thread details
    expect(detailedThread).toEqual({
      id: 'thread-123',
      title: 'Test Thread',
      body: 'Thread body',
      date: '2023-01-01',
      username: 'johndoe',
      comments: [
        {
          id: 'comment-123',
          username: 'jane',
          date: '2023-01-02',
          replies: [
            {
              id: 'reply-123',
              username: 'jack',
              date: '2023-01-04',
              content: 'First reply',
            },
            {
              id: 'reply-456',
              username: 'jill',
              date: '2023-01-05',
              content: '**balasan telah dihapus**',
            },
          ],
          likeCount: 2,
          content: 'First comment',
        },
        {
          id: 'comment-456',
          username: 'john',
          date: '2023-01-03',
          replies: [
            {
              id: 'reply-123',
              username: 'jack',
              date: '2023-01-04',
              content: 'First reply',
            },
            {
              id: 'reply-456',
              username: 'jill',
              date: '2023-01-05',
              content: '**balasan telah dihapus**',
            },
          ],
          likeCount: 1,
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });
});

// const ReplysRepository = require('../../../Domains/replys/ReplysRepository');
// const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
// const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
// const LikeRepository = require('../../../Domains/likes/LikeRepository');
// const GetDetailThreadById = require('../GetDetailThreadByIdUseCase');

// describe('GetDetailThreadById', () => {
//   it('should orchestrate the get detail thread action correctly', async () => {
//     // Arrange
//     const useCasePayload = {
//       threadId: 'thread-123',
//     };

//     // Mock repositories
//     const mockThreadRepository = new ThreadRepository();
//     const mockCommentsRepository = new CommentsRepository();
//     const mockReplysRepository = new ReplysRepository();
// const mockLikeRepository = new LikeRepository();

//     // Mock thread detail
//     const mockThread = {
//       id: 'thread-123',
//       title: 'Test Thread',
//       body: 'Thread body',
//       date: '2023-01-01',
//       username: 'johndoe',
//     };

//     // Mock comments
//     const mockComments = [
//       {
//         id: 'comment-123',
//         username: 'jane',
//         date: '2023-01-02',
//         content: 'First comment',
//         is_delete: false,
//       },
//       {
//         id: 'comment-456',
//         username: 'john',
//         date: '2023-01-03',
//         content: 'Second comment',
//         is_delete: true,
//       },
//     ];

//     // Mock replies
//     const mockReplies = [
//       {
//         id: 'reply-123',
//         comment_id: 'comment-123',
//         username: 'jack',
//         created_at: '2023-01-04',
//         content: 'First reply',
//         is_delete: false,
//       },
//       {
//         id: 'reply-456',
//         comment_id: 'comment-456',
//         username: 'jill',
//         created_at: '2023-01-05',
//         content: 'Second reply',
//         is_delete: true,
//       },
//     ];

//     // Mock likes
//     const mockLikes = {
//       'comment-123': 5,
//       'comment-456': 3,
//     };

//     // Mocking repository methods
//     mockThreadRepository.verifyAvailabilityThread = jest.fn(() => Promise.resolve());
//     mockThreadRepository.getDetailThreadById = jest.fn(() => Promise.resolve(mockThread));
//     mockCommentsRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
//     mockReplysRepository.getAllReplies = jest.fn(() => Promise.resolve(mockReplies));
//     mockLikeRepository.getAllLikes = jest.fn(() => Promise.resolve(mockLikes));

//     // Create use case instance
//     const getDetailThreadByIdUseCase = new GetDetailThreadById({
//       threadRepository: mockThreadRepository,
//       commentsRepository: mockCommentsRepository,
//       replyRepository: mockReplysRepository,
//       likeRepository: mockLikeRepository,
//     });

//     // Action
//     const detailedThread = await getDetailThreadByIdUseCase.execute(useCasePayload);

//     // Assert
//     expect(mockThreadRepository.verifyAvailabilityThread)
//       .toBeCalledWith(useCasePayload.threadId);
//     expect(mockThreadRepository.getDetailThreadById)
//       .toBeCalledWith(useCasePayload.threadId);
//     expect(mockCommentsRepository.getCommentsByThreadId)
//       .toBeCalledWith(useCasePayload.threadId);
//     expect(mockReplysRepository.getAllReplies)
//       .toBeCalledWith(['comment-123', 'comment-456']);
//     expect(mockLikeRepository.getAllLikes)
//       .toBeCalledWith(['comment-123', 'comment-456']);

//     // Verify thread details
//     expect(detailedThread).toEqual({
//       id: 'thread-123',
//       title: 'Test Thread',
//       body: 'Thread body',
//       date: '2023-01-01',
//       username: 'johndoe',
//       comments: [
//         {
//           id: 'comment-123',
//           username: 'jane',
//           date: '2023-01-02',
//           replies: [
//             {
//               id: 'reply-123',
//               username: 'jack',
//               date: '2023-01-04',
//               content: 'First reply',
//             },
//           ],
//           content: 'First comment',
//           likeCount: 5,
//         },
//         {
//           id: 'comment-456',
//           username: 'john',
//           date: '2023-01-03',
//           replies: [
//             {
//               id: 'reply-456',
//               username: 'jill',
//               date: '2023-01-05',
//               content: '**balasan telah dihapus**',
//             },
//           ],
//           content: '**komentar telah dihapus**',
//           likeCount: 3,
//         },
//       ],
//     });
//   });
// });
