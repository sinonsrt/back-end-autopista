import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CompanyImage extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public image: string

  @column()
  public company_id: string

  @column()
  public deleted_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
