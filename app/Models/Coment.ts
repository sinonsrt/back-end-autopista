import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidv5 } from 'uuid'
import User from './User'
import Company from './Company'

export default class Coment extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public content: string

  @column()
  public user_id: string

  @column()
  public company_id: string

  @column()
  public deleted_at: DateTime

  @hasMany(() => User, {
    localKey: 'user_id',
    foreignKey: 'id'
  })
  public user: HasMany<typeof User>

  @hasMany(() => Company, {
    localKey: 'company_id',
    foreignKey: 'id'
  })
  public company: HasMany<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUUID(coment: Coment) {
    if(!coment.id){
      coment.id = uuidv5(DateTime.now().toString(), Env.get('UUID_NAMESPACE'))
    }
  }
}
