exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('thread_comment_replies', {
    id: {
      type: 'VARCHAR(50)',
      primary: true,
    },
    content: {
      type: 'TEXT',
      notNUll: true,
    },
    thread_comment_id: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deleted_at: {
      type: 'TIMESTAMP',
      notNull: false,
      default: null,
    },
  });

  pgm.addConstraint('thread_comment_replies', 'fk_thread_comment_replies.thread_comment_id_thread_comments.id', 'FOREIGN KEY(thread_comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE');
  pgm.addConstraint('thread_comment_replies', 'fk_thread_comment_replies.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comment_replies', 'fk_thread_comment_replies.thread_comment_id_thread_comments.id');
  pgm.dropConstraint('thread_comment_replies', 'fk_thread_comment_replies.user_id_users.id');
  pgm.dropTable('thread_comment_replies');
};
