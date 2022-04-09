import { validator } from './../../../config/app';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rate from 'App/Models/Rate';
import User from "App/Models/Rate";
// import Database from "@ioc:Adonis/Lucid/Database";
import CreateRateValidator from 'App/Validators/CreateRateValidator';
import UpdateRateValidator from 'App/Validators/UpdateRateValidator'
import { Application } from '@adonisjs/core/build/standalone';
import fs from "fs";
import Media from 'App/Models/Media';

export default class RatesController {
  public async index({ }: HttpContextContract) {
    let rates = await Rate.query().preload('image')
    return rates;
  }

  public async create({ request }: HttpContextContract) {
    //   //  Request validation
    //   await this.validate(request);
    // return request;
  }

  public async store({ request }: HttpContextContract) {
    //  Request validation
    await request.validate(CreateRateValidator)
    let rate = await Rate.create(request.only(['title', 'price', 'description']))
    await this.upload_image(request, rate)
    rate = await Rate.query().preload('image').where('id', rate.id).first()
    return rate;
  }

  private async upload_image(request: HttpContextContract, rate: Object) {
    const file = request.file('photo');
    await file.moveToDisk('./package_images');
    const file_arr = file.filePath.split('/')
    let image = {}
    image.mime_type = file.type + '/' + file.extname;
    image.file_name = file_arr[file_arr.length - 1];
    image.type = 'rate';
    image.type_id = rate.id
    image.url = process.env.FILE_PATH + '/package_images/' + file_arr[file_arr.length - 1];
    return await Media.create(image);
  }

  public async show({ params }) {
    return await Rate.query().preload('image').where('id', params.id).first()
  }

  public async edit({ }: HttpContextContract) { }

  public async update({params, request }: HttpContextContract) {
    await request.validate(UpdateRateValidator)
    if(request.file('photo')) {
     let rate = await Rate.query().preload('image').where('id',params.id).first()
      rate.image.delete()
      this.delete_img(rate.image.file_name)
      await this.upload_image(request, rate)
    }
    await Rate
    .query()
    .where('id', params.id)
    .update(request.only(['title', 'price', 'description']))
   }

  public async destroy({ params}) {
    let rate = await Rate.query().preload('image').where('id',params.id).first()
    rate.image.delete()
    rate.delete()
   this.delete_img(rate.image.file_name)
    return {message: 'Rate has deleted!'};

  }
  private async delete_img(image_name) {
    fs.unlink('./tmp/uploads/package_images/' + image_name, function (err) {
      // you cannot write anymore to response now.
      // return err
  })
  }
}
