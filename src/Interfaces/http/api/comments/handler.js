const autoBind = require('auto-bind');
const AddCommentsUseCase = require('../../../../Applications/use_case/AddCommentsUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentsUseCase = this._container.getInstance(
      AddCommentsUseCase.name,
    );
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;
    const addedComment = await addCommentsUseCase.execute(
      threadId,
      owner,
      content,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    const { id: owner } = request.auth.credentials;
    const { threadId, commentsId } = request.params;

    await deleteCommentUseCase.execute(commentsId, owner, threadId);

    const response = h.response({
      status: 'success',
      message: 'komentar berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
