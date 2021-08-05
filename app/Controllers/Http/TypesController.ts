import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'App/Models/Type'
import { DateTime } from 'luxon'

export default class TypesController {
  public async index({ request, response }: HttpContextContract) {
    const { search } = request.all()
    try {
      const types = Type.query().whereNull('deleted_at')
      if(search) types.where('description', 'ILIKE', '%' + search + '%')
      return await types
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['description'])
      await Type.create(data)

      response.status(200).send('Tipo cadastado com sucesso!')
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const type = await Type.findOrFail(params.id)

      return type
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = request.only(['description'])
      const type = await Type.findOrFail(params.id)

      type.merge(data)
      type.save()

      response.status(200).send('Tipo atualizado com sucesso!')
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const data = { deleted_at: DateTime.now() }
      const type = await Type.findOrFail(params.id)

      type.merge(data)
      type.save()

      response.status(200).send('Tipo excluido com sucesso!')
    } catch (error) {
      response.status(error.status).send('Erro: ' + error)
    }
  }
}
