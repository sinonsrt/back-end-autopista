import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccessLevels extends BaseSchema {
  protected tableName = 'access_levels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('description', 120).notNullable()
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
