import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { v5 as uuidv5 } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import Company from './Company'

export default class Code extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public code: string
  
  @column()
  public company_id: string

  @column()
  public user_id: string

  @column()
  public deleted_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Company, {
    localKey: 'company_id',
    foreignKey: 'id'
  })
  public company: HasMany<typeof Company>

  @beforeCreate()
  public static assignUUID(code: Code) {
    if(!code.id){
      code.id = uuidv5(DateTime.now().toString(), Env.get('UUID_NAMESPACE'))
    }
  }
}
