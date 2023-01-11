/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNUll: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
  });

  pgm.addConstraint('thread_comments', 'fk_thread_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('thread_comments', 'fk_thread_comments.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comments', 'fk_thread_comments.thread_id_threads.id');
  pgm.dropConstraint('thread_comments', 'fk_thread_comments.user_id_users.id');
  pgm.dropTable('thread_comments');
};
