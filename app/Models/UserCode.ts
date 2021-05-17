import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate} from '@ioc:Adonis/Lucid/Orm'
import { v5 as uuidv5 } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'

export default class UserCode extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public code_id: string

  @column()
  public user_id: string

  @column()
  public deleted_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUUID(userCode: UserCode) {
    if(!userCode.id){
      userCode.id = uuidv5(DateTime.now().toString(), Env.get('UUID_NAMESPACE'))
    }
  }
}
