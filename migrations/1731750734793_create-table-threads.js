/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint('threads', 'fk_threads_owner_users_id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
