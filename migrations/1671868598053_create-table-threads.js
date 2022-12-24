/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNUll: true,
    },
    content: {
      type: 'TEXT',
      notNUll: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
    created_ad: {
      type: 'TIMESTAMP WITH TIME ZONE',
      notNUll: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMP WITH TIME ZONE',
      notNUll: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('threads', 'fk_threads.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('threads', 'fk_threads.user_id_users.id');
  pgm.dropTable('threads');
};
