import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ComapanyImages extends BaseSchema {
  protected tableName = 'company_images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('image').notNullable()
      table.uuid('company_id').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
