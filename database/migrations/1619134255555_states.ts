import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class States extends BaseSchema {
  protected tableName = 'states'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('description')
      table.string('initials')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
