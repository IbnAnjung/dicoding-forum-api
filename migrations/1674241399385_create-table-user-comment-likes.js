/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    user_id: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNUll: true,
    },
  });

  pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.user_id_thread_comments.id', 'FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_comment_likes', 'fk_user_comment_likes.user_id_users.id');
  pgm.dropConstraint('user_comment_likes', 'fk_user_comment_likes.user_id_thread_comments.id');
  pgm.dropTable('user_comment_likes');
};
