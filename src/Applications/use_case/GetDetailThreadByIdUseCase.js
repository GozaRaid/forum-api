class GetDetailThreadById {
  constructor({ threadRepository, commentsRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentsRepository = commentsRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailabilityThread(useCasePayload.threadId);
    const thread = await this._threadRepository.getDetailThreadById(useCasePayload.threadId);
    const comments = await this._commentsRepository.getCommentsByThreadId(useCasePayload.threadId);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getAllReplies(comment.id);
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
        };
      }),
    );

    thread.comments = commentsWithReplies;

    return thread;
  }
}

module.exports = GetDetailThreadById;
