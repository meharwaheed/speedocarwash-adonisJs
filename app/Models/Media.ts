import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Media extends BaseModel {
  public static  table = 'media';
  @column({ isPrimary: true })
  public id: number

  @column()
  public file_name: string

  @column()
  public mime_type: string

  @column()
  public url: string

  @column()
  public type: string

  @column()
  public type_id: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
