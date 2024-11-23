// not test yet
const AddThread = require('../../../Domains/thread/entities/AddThread');
const AddedThread = require('../../../Domains/thread/entities/AddedThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadsUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };
    const mockThreadsRepository = new ThreadRepository();
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });
    mockThreadsRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadsUseCase = new AddThreadUseCase({
      threadsRepository: mockThreadsRepository,
    });

    // Action
    const addedThread = await addThreadsUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadsRepository.addThread)
      .toHaveBeenCalledWith(useCasePayload);
  });
});
