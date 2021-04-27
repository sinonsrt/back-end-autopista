import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Coments extends BaseSchema {
  protected tableName = 'coments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('content', 120).notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users')
      table.uuid('company_id').notNullable().references('id').inTable('companies')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
