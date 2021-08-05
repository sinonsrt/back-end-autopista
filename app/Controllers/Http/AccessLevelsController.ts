import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessLevel from 'App/Models/AccessLevel'
import { DateTime } from 'luxon'

export default class AccessLevelsController {
  public async index ({ request, response }: HttpContextContract) {
    const { search } = request.all()
    try{
      const accessLevels = AccessLevel.query().whereNull('deleted_at')
      if(search) accessLevels.where('description', 'ILIKE', "%" + search + "%")
      return await accessLevels
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async store ({ request, response }: HttpContextContract) {
    try{
      const data = request.only(['description'])
      await AccessLevel.create(data)

      response
        .status(200)
        .send('Nível de acesso cadastado com sucesso!')

    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async show ({ response, params }: HttpContextContract) {
    try{
      const accessLevel = await AccessLevel.findOrFail(params.id)

      return accessLevel
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try{
      const data = request.only(['description'])
      const accessLevel = await AccessLevel.findOrFail(params.id)

      accessLevel.merge(data)
      accessLevel.save()

      response
        .status(200)
        .send('Nível de acesso atualizado com sucesso!')
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const data = {deleted_at: DateTime.now()}
      const accessLevel = await AccessLevel.findOrFail(params.id)

      accessLevel.merge(data)
      accessLevel.save()

      response
        .status(200)
        .send('Nível de acesso excluido com sucesso!')
    } catch(error){
      response
        .status(error.status)
        .send('ERROR: ' + error)
    }
  }
}
