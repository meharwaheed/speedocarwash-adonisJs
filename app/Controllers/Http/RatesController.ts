import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rate from 'App/Models/Rate';
import User from "App/Models/Rate";
// import Database from "@ioc:Adonis/Lucid/Database";
import CreateRateValidator from 'App/Validators/CreateRateValidator';
import { Application } from '@adonisjs/core/build/standalone';
import Media from 'App/Models/Media';

export default class RatesController {
  public async index({}: HttpContextContract) {
    let rates = await  Rate.query().preload('image')
    return rates;
  }

  public async create({request}: HttpContextContract) {
    //   //  Request validation
    //   await this.validate(request);
    // return request;
  }

  public async store({request}: HttpContextContract) {
          //  Request validation
        await request.validate(CreateRateValidator)
        let rate = await Rate.create(request.only(['title', 'price', 'description']))
        await this.upload_image(request, rate)
        rate = await  Rate.query().preload('image').where('id',rate.id).first()
        return rate;
  }

  private async upload_image(request: HttpContextContract,rate: Object )  {
    const file = request.file('image');
    await file.moveToDisk('./package_images');
    const file_arr = file.filePath.split('/')
    let image = {}
    image.mime_type = file.type + '/' + file.extname;
    image.file_name = file.clientName;
    image.type = 'rate';
    image.type_id= rate.id
    image.url= process.env.FILE_PATH + '/package_images/' + file_arr[file_arr.length-1] ;
    return await Media.create(image);
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
