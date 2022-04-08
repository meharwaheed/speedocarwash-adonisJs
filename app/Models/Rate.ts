import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Media from 'App/Models/Media'

export default class Rate extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Media, {
    localKey: 'id', // defaults to id
    foreignKey: 'type_id'
  })
  public image: HasOne<typeof Media>
}
