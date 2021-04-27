import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidv5 } from 'uuid'

export default class GasService extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public description: string

  @column()
  public deleted_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUUID(gas: GasService) {
    if(!gas.id){
      gas.id = uuidv5(DateTime.now().toString(), Env.get('UUID_NAMESPACE'))
    }
  }
}
