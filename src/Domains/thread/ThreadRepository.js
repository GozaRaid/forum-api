class ThreadRepository {
  async addThread(thread) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityThread(id) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
