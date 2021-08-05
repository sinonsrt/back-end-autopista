import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from 'App/Models/Service'
import { DateTime } from 'luxon'

export default class ServicesController {
  public async index({ request, response }: HttpContextContract) {
    const { search } = request.all()
    try {
      const service = Service.query().whereNull('deleted_at').preload('type')
      if(search) service.where('description', 'ILIKE', '%' + search + '%')
      return await service
    } catch (error) {
      response.status(error.status).send('Erro ao listar serviços: ' + error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['description', 'type_id'])
      await Service.create(data)

      response.status(200).send('Serviço cadastrado com sucesso!')
    } catch (error) {
      response.status(400).send('Erro ao cadastrar serviço: ' + error)
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const service = await Service.findOrFail(params.id)

      return service
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = request.only(['description'])
      const service = await Service.findOrFail(params.id)

      service.merge(data)
      service.save()

      response.status(200).send('Serviço atualizado com sucesso!')
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const data = { deleted_at: DateTime.now() }
      const service = await Service.findOrFail(params.id)

      service.merge(data)
      service.save()

      response.status(200).send('Serviço excluido com sucesso!')
    } catch (error) {
      response.status(error.status).send('Erro: ' + error)
    }
  }
}
