import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Media extends BaseSchema {
  protected tableName = 'media'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('file_name');
      table.string('mime_type');
      table.string('type');
      table.bigInteger('type_id');
      table.text('url').nullable();
      table.timestamps(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
