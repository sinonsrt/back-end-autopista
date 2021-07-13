import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WorkedDay from 'App/Models/WorkedDay'
import { DateTime } from 'luxon'

export default class WorkedDaysController {
  public async index({ response }: HttpContextContract) {
    try {
      const worked_days = await WorkedDay.query().whereNull('deleted_at')
      return worked_days
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['description'])
      await WorkedDay.create(data)

      response.status(200).send('Cadastado com sucesso!')
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const worked_days = await WorkedDay.findOrFail(params.id)

      return worked_days
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = request.only(['description'])
      const worked_days = await WorkedDay.findOrFail(params.id)

      worked_days.merge(data)
      worked_days.save()

      response.status(200).send('Atualizado com sucesso!')
    } catch (error) {
      response.status(error.status).send('ERROR: ' + error)
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const data = { deleted_at: DateTime.now() }
      const worked_days = await WorkedDay.findOrFail(params.id)

      worked_days.merge(data)
      worked_days.save()

      response.status(200).send('Excluido com sucesso!')
    } catch (error) {
      response.status(error.status).send('Erro: ' + error)
    }
  }
}
