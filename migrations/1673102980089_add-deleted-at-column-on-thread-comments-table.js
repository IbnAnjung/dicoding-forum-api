/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('thread_comments', {
    deleted_at: {
      type: 'TIMESTAMP',
      notNUll: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('thread_comments', ['deleted_at']);
};
