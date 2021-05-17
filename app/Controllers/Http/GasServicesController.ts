import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GasService from 'App/Models/GasService'
import { DateTime } from 'luxon'

export default class GasServicesController {
  public async index ({ response }: HttpContextContract) {try{
    const gasServices = await GasService.query()
    return gasServices
  } catch(error){
    response
      .status(error.status)
      .send('ERROR: ' + error)
  }
  }
  public async store ({ request, response }: HttpContextContract) {
    try{
      const data = request.only(['description'])
      await GasService.create(data)

      response
        .status(200)
        .send('Serviço de posto cadastado com sucesso!')

    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async show ({ response, params }: HttpContextContract) {
    try{
      const gasService = await GasService.findOrFail(params.id)

      return gasService
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try{
      const data = request.only(['description'])
      const gasService = await GasService.findOrFail(params.id)

      gasService.merge(data)
      gasService.save()

      response
        .status(200)
        .send('Serviço de posto atualizado com sucesso!')
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const data = { deleted_at: DateTime.now() }
      const gasService = await GasService.findOrFail(params.id)

      gasService.merge(data)
      gasService.save()

      response
        .status(200)
        .send('Serviço de posto excluido com sucesso!')
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }
}

