import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from 'App/Models/Service'
import { DateTime } from 'luxon'

export default class ServicesController {
  public async index ({ response }: HttpContextContract) {try{
    const service = await Service.query()
    return service
  } catch(error){
    response
      .status(error.status)
      .send('ERROR: ' + error)
  }
  }
  public async store ({ request, response }: HttpContextContract) {
    try{
      const data = request.only(['description'])
      await Service.create(data)

      response
        .status(200)
        .send('Serviço cadastado com sucesso!')

    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async show ({ response, params }: HttpContextContract) {
    try{
      const service = await Service.findOrFail(params.id)

      return service
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try{
      const data = request.only(['description'])
      const service = await Service.findOrFail(params.id)

      service.merge(data)
      service.save()

      response
        .status(200)
        .send('Serviço atualizado com sucesso!')
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const data = {
        deleted_at: DateTime.now()
      }
      const service = await Service.findOrFail(params.id)

      service.merge(data)
      service.save()

      response
        .status(200)
        .send('Serviço excluido com sucesso!')
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }
}
