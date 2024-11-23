const autoBind = require('auto-bind');
const AddCommentsUseCase = require('../../../../Applications/use_case/AddCommentsUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentsUseCase = this._container.getInstance(AddCommentsUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const addedComment = await addCommentsUseCase.execute(threadId, owner, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
