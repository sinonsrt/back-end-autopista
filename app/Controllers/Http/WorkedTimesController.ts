import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WorkedTime from 'App/Models/WorkedTime'
import { DateTime } from 'luxon'

export default class WorkedTimesController {
  public async index({ request,  response }: HttpContextContract) {
    const { search } = request.all()
    try {
      const worked_times = WorkedTime.query().whereNull('deleted_at')
      if(search) worked_times.where('description', 'ILIKE', '%' + search + '%')
      return await worked_times
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['description'])
      await WorkedTime.create(data)

      response.status(200).send('Cadastado com sucesso!')
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const worked_times = await WorkedTime.findOrFail(params.id)

      return worked_times
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = request.only(['description'])
      const worked_times = await WorkedTime.findOrFail(params.id)

      worked_times.merge(data)
      worked_times.save()

      response.status(200).send('Atualizado com sucesso!')
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const data = { deleted_at: DateTime.now() }
      const worked_times = await WorkedTime.findOrFail(params.id)

      worked_times.merge(data)
      worked_times.save()

      response.status(200).send('Excluido com sucesso!')
    } catch (error) {
      response.status(error.status).send('Erro: ' + error)
    }
  }
}
