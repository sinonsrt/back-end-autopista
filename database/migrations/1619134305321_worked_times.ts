import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WorkedTimes extends BaseSchema {
  protected tableName = 'worked_times'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('description', 120)
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
