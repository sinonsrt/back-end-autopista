import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidv5 } from 'uuid'
import Type from './Type'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public type_id: string

  @column()
  public deleted_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Type, {
    localKey: 'type_id',
    foreignKey: 'id'
  })
  public type: HasMany<typeof Type>

  @beforeCreate()
  public static assignUUID(service: Service) {
    if (!service.id) {
      service.id = uuidv5(DateTime.now().toString(), Env.get('UUID_NAMESPACE'))
    }
  }
}
