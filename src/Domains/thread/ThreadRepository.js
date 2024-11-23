class ThreadRepository {
  async addThread(thread) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityThread(threadId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getDetailThreadById(threadId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
