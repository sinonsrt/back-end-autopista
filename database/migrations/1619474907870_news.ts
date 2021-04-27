import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class News extends BaseSchema {
  protected tableName = 'news'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('link').notNullable()
      table.string('image').notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
