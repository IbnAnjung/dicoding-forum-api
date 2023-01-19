exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    like_count: {
      type: 'INTEGER',
      notNull: true,
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('thread_comments', ['like_count']);
};
