import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Services extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('description').notNullable()
      table.uuid('type_id').references('id').inTable('types')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
