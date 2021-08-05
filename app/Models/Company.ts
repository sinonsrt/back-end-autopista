import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidv5 } from 'uuid'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public avatar: string

  @column()
  public company_name: string

  @column()
  public corporate_name: string

  @column()
  public cnpj: string

  @column()
  public ie: string

  @column()
  public cep: string

  @column()
  public address: string

  @column()
  public district: string

  @column()
  public number: number

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public stars: number

  @column()
  public worked_time_id: string

  @column()
  public worked_day_id: number

  @column()
  public user_id: string

  @column()
  public type_id: string

  @column()
  public city_id: number

  @column()
  public confirmed: boolean

  @column()
  public deleted_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(company: Company){
    company.id = uuidv5(DateTime.now().toString(), Env.get('UUID_NAMESPACE'))
  }
}
