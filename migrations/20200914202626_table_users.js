exports.up = function(knex, promises) {
  return knex.schema.createTable('users', table => {
      table.increments('id').primary()
      table.string('user').notNull()
      table.string('email').notNull()
      table.string('password').notNull()
      table.boolean('playday').defaultTo(true)
      table.string('money').notNull().defaultTo('100000')
      table.timestamp('date')
      table.specificType('idArray', 'integer ARRAY')
  })
};

exports.down = function(knex, promises) {
    return knex.schema.dropTable('users')
  
};
