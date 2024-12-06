const AddLike = require('../AddLike');

describe('AddLike', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addLike object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const addLike = new AddLike(payload);

    // Assert
    expect(addLike).toBeInstanceOf(AddLike);
    expect(addLike.commentId).toEqual(payload.commentId);
    expect(addLike.owner).toEqual(payload.owner);
  });
});
