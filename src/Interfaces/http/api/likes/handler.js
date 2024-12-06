const autoBind = require('auto-bind');
const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async putLikeHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(AddLikeUseCase.name);
    const requestPayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth.credentials.id,
    };
    await likeCommentUseCase.execute(requestPayload);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
