import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidv5 } from 'uuid'
import City from './City'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public confirmed: boolean

  @column()
  public phone: string

  @column()
  public avatar: string

  @column()
  public city_id: number

  @column()
  public rememberMeToken?: string

  @column()
  public access_level: number

  @column()
  public deletedAt: DateTime

  @column()
  public company_id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => City, {
    localKey: "city_id",
    foreignKey: "id"
  })
  public city: HasMany<typeof City>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static assignUuid(user: User){
    user.id = uuidv5(DateTime.now().toString(), Env.get('UUID_NAMESPACE'))
  }
}
