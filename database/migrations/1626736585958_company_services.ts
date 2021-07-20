import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CompanyServices extends BaseSchema {
  protected tableName = 'company_services'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('company_id').references('id').inTable('companies')
      table.uuid('service_id').references('id').inTable('services')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
