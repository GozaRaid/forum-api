const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadByIdUseCase = require('../../../../Applications/use_case/GetDetailThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const useCasePayload = {
      owner,
      ...request.payload,
    };
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadById(request, h) {
    const { threadId } = request.params;
    const getDetailThreadByIdUseCase = this._container.getInstance(GetDetailThreadByIdUseCase.name);
    const detailThread = await getDetailThreadByIdUseCase.execute({ threadId });
    const response = h.response({
      status: 'success',
      data: {
        thread: detailThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
