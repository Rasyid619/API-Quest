exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('books', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    author: {
      type: 'text',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('books')
}
