import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rates extends BaseSchema {
  protected tableName = 'rates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title');
      table.text('description');
      table.bigInteger('price');
      table.timestamps(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
