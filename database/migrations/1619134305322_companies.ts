import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('avatar')
      table.string('company_name').notNullable()
      table.string('corporate_name').notNullable()
      table.string('cnpj')
      table.string('ie')
      table.string('cep')
      table.string('address')
      table.string('district')
      table.integer('number')
      table.string('phone')
      table.string('email')
      table.integer('stars')
      table.boolean('confirmed')
      table.uuid('user_id').references('id').inTable('users')
      table.uuid('type_id').references('id').inTable('types')
      table.uuid('worked_day_id').references('id').inTable('worked_days')
      table.uuid('worked_time_id').references('id').inTable('worked_times')
      table.integer('access_level').references('id').inTable('access_levels').notNullable()
      table.integer('city_id').references('id').inTable('cities')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
