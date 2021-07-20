import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Company from 'App/Models/Company'
import { DateTime } from 'luxon'
import { v5 as uuidv5 } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import CompanyService from 'App/Models/CompanyService'
import Application from '@ioc:Adonis/Core/Application'
import md5 from 'md5'

export default class CompaniesController {
  public async index({ response }: HttpContextContract) {
    try {
      const companies = await Company.query().whereNull('deleted_at')
      return companies
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const dataCompany = request.only([
        'company_name',
        'corporate_name',
        'cnpj',
        'ie',
        'cep',
        'address',
        'phone',
        'district',
        'number',
        'phone',
        'email',
        'stars',
        'user_id',
        'type_id',
        'worked_day_id',
        'worked_time_id',
        'city_id',
      ])

      const dataService = request.input('services')

      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      })

      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move(Application.publicPath('company'), {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })

      const company = new Company()
      company.fill({ ...dataCompany, avatar: avatar?.fileName })
      company.useTransaction(trx)
      await company.save()

      const services = dataService.map((data) => ({
        id: uuidv5(DateTime.now().toString() + Math.random(), Env.get('UUID_NAMESPACE')),
        company_id: company.id,
        service_id: data.service_id,
        field: data.field,
        created_at: DateTime.now()
      }))

      await Database.table('company_services').multiInsert(services).useTransaction(trx)

      response.status(200).send('Empresa cadastrada com sucesso!')
    }).catch((error) => {
      response.status(400).send('Erro: ' + error)
    })
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const company = await Company.findOrFail(params.id)
      const service = await CompanyService.query().where('company_id', params.id)

      return { 
        company: company, 
        service: service
      }
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const dataCompany = request.only([
        'company_name',
        'corporate_name',
        'cnpj',
        'ie',
        'cep',
        'address',
        'phone',
        'district',
        'number',
        'phone',
        'email',
        'stars',
        'user_id',
        'type_id',
        'worked_day_id',
        'worked_time_id',
        'city_id',
      ])

      const dataService = request.input('services')

      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      })

      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move(Application.publicPath('company'), {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })

      const company = await (await Company.findOrFail(params.id)).merge(dataCompany).useTransaction(trx).save()
      const services = await CompanyService.query().where('company_id', params.id).whereNull('deleted_at')

      services.map(async (data) => {
        await (await CompanyService.findOrFail(data.id)).useTransaction(trx).delete()
      })

      const dtServices = dataService.map((data) => ({
        id: uuidv5(DateTime.now().toString() + Math.random(), Env.get('UUID_NAMESPACE')),
        company_id: company.id,
        service_id: data.service_id,
        field: data.field,
        created_at: DateTime.now()
      }))

      await Database.table('company_services').multiInsert(dtServices).useTransaction(trx)

      response.status(200).send('Empresa atualizada com sucesso!')
    }).catch((error) => {
      response.status(400).send('Erro: ' + error)
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
      const data = { deleted_at: DateTime.now() }
      await Database.transaction(async (trx) => {

        await (await Company.findOrFail(params.id)).merge(data).useTransaction(trx).save()
        const services = await CompanyService.query().where('company_id', params.id).whereNull('deleted_at')

        services.map(async (data) => {
          await (await CompanyService.findOrFail(data.id)).merge(data).useTransaction(trx).save()
        })
  
        response.status(200).send('Empresa excluida com sucesso!')
      }).catch ((error) => {
      response.status(400).send('Erro: ' + error)
    })
  }
}
