const autoBind = require('auto-bind');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplysHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const { content } = request.payload;
    const useCasePayload = {
      threadId,
      commentId,
      owner,
      content,
    };
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name,
    );
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const useCasePayload = {
      replyId,
      commentId,
      owner,
      threadId,
    };

    await deleteReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'balasan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = ReplysHandler;
