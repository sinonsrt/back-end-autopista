import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public description: string

  @column()
  public uf_id: number

  @column()
  public ibge: string

  @hasMany(() => State, {
    localKey: 'uf_id',
    foreignKey: 'id'
  })
  public state: HasMany<typeof State>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
