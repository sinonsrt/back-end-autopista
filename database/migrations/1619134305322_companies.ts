import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('company_name', 120).notNullable()
      table.string('corporate_name', 120).notNullable()
      table.string('cnpj', 11)
      table.string('ie', 25)
      table.string('cep', 8)
      table.string('district', 120)
      table.integer('number', 4)
      table.string('phone', 15)
      table.integer('stars')
      table.time('start_time')
      table.time('end_time')
      table.integer('worked_days', 120)
      table.string('image')
      table.string('location')
      table.uuid('user_id').notNullable().references('id').inTable('users')
      table.uuid('service_id').notNullable().references('id').inTable('services')
      table.uuid('service_gas_id').notNullable().references('id').inTable('gas_services')
      table.uuid('type_id').notNullable().references('id').inTable('types')
      table.integer('city_id').notNullable().references('id').inTable('cities')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
