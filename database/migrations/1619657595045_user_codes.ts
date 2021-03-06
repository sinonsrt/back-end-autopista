import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserCodes extends BaseSchema {
  protected tableName = 'user_codes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('comment', 120).notNullable()
      table.uuid('code_id').references('id').inTable('codes')
      table.uuid('company_id').references('id').inTable('companies')
      table.double('star').notNullable()
      table.uuid('user_id').references('id').inTable('users')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
