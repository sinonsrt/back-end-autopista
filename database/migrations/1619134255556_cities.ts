import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cities extends BaseSchema {
  protected tableName = 'cities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('description')
      table.integer('uf_id')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
