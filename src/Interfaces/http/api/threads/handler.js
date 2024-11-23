const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadById = require('../../../../Applications/use_case/GetDetailThreadById');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(owner, request.payload);

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
    const getDetailThreadById = this._container.getInstance(GetDetailThreadById.name);
    const detailThread = await getDetailThreadById.execute(threadId);
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
