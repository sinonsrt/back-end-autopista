import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Codes extends BaseSchema {
  protected tableName = 'codes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('code').notNullable()
      table.uuid('company_code').notNullable().references('id').inTable('companies')
      table.uuid('user_id').notNullable().references('id').inTable('users')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
