class GetDetailThreadById {
  constructor({
    threadRepository,
    commentsRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentsRepository = commentsRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
    const thread = await this._threadRepository.getDetailThreadById(useCasePayload.threadId);
    const comments = await this._commentsRepository.getCommentsByThreadId(useCasePayload.threadId);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getAllReplies(comment.id);
        const likeCount = await this._likeRepository.getAllLikes(comment.id);
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          replies: replies.map((reply) => ({
            id: reply.id,
            username: reply.username,
            date: reply.date,
            content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
          })),
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          likeCount,
        };
      }),
    );

    thread.comments = commentsWithReplies;

    return thread;
  }
}

//   async execute(useCasePayload) {
//     await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
//     const thread = await this._threadRepository.getDetailThreadById(useCasePayload.threadId);
//     const comments = await this._commentsRepository
//       .getCommentsByThreadId(useCasePayload.threadId);

//     if (comments.length === 0) {
//       thread.comments = [];
//       return thread;
//     }

//     const commentIds = comments.map((comment) => comment.id);

//     const replies = await this._replyRepository.getAllReplies(commentIds);
//     const likes = await this._likeRepository.getAllLikes(commentIds);

//     const repliesGroupedByCommentId = replies.reduce((acc, reply) => {
//       if (!acc[reply.comment_id]) {
//         acc[reply.comment_id] = [];
//       }
//       acc[reply.comment_id].push({
//         id: reply.id,
//         username: reply.username,
//         date: reply.created_at,
//         content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
//       });
//       return acc;
//     }, {});

//     const commentsWithReplies = comments.map((comment) => ({
//       id: comment.id,
//       username: comment.username,
//       date: comment.date,
//       replies: repliesGroupedByCommentId[comment.id] || [],
//       content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
//       likeCount: likes[comment.id] || 0,
//     }));

//     thread.comments = commentsWithReplies;

//     return thread;
//   }
// }
module.exports = GetDetailThreadById;
