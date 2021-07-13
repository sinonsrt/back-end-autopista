import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from "App/Models/City"

export default class CitiesController {

  public async index ({ request, response }: HttpContextContract) {
    try{
      const { page, limit, order, type, search } = request.qs()
      if(search){
        const cities = await City.query().preload('state').where('description', 'ILIKE' , '%' + `${search}` + '%').orWhere('id', '!=', '0').orderBy(order, type).paginate(page, limit)
        return cities
      } else {
        const cities = await City.query().preload('state').where('id', '!=', '0').orderBy(order, type).paginate(page, limit)
        return cities
      }
    }catch(err){
      response
        .status(400)
        .send('ERROR: ' + err)
    }
  }
}
