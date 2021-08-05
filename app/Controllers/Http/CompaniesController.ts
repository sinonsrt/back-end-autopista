import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Company from 'App/Models/Company'
import { DateTime } from 'luxon'
import { v5 as uuidv5 } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import CompanyService from 'App/Models/CompanyService'
import Application from '@ioc:Adonis/Core/Application'
import md5 from 'md5'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export default class CompaniesController {
  public async index({ request, response }: HttpContextContract) {
    const { order, type, company_type, confirmed, search } = request.all()
    try {
      let dtOrder = `companies.${order}`
      if (order === 'description') dtOrder = `types.${order}`
      const companies = Database.from('companies')
        .select(
          'companies.*',
          'types.id as type_id',
          'types.description',
          'cities.uf_id',
          'cities.description',
          'states.initials'
        )
        .whereNull('companies.deleted_at')
        .join('types', 'companies.type_id', 'types.id')
        .join('cities', 'companies.city_id', 'cities.id')
        .join('states', 'cities.uf_id', 'states.id')
      if (company_type) companies.where('types.description', company_type)
      if (confirmed) companies.where('confirmed', confirmed)
      if (search) companies.where('corporate_name', 'ILIKE', '%' + search + '%')
      return await companies.orderByRaw(`${dtOrder} ${type}`)
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async companyConfirm({ response, params }: HttpContextContract) {
    try {
      const company = await (await Company.findOrFail(params.id)).merge({ confirmed: true }).save()

      await Mail.send((message) => {
        message
          .from(`${Env.get('SMTP_USERNAME')}`)
          .to(company.email)
          .subject('Bem-vindo ao AutoPista').html(`
            <h1> Seja bem-vindo, ${company.company_name}. </h1> <br>
            <h2> O seu cadastro foi confirmado com sucesso! </h2>
          `)
      })

      response.status(200).send('Empresa confirmada com sucesso!')
    } catch (error) {
      console.log(error)
      response.status(400).send('Erro: ' + error)
    }
  }

  public async companyRegister({ request, response }: HttpContextContract) {
    const dataCompany = request.only([
      'company_name',
      'corporate_name',
      'cnpj',
      'ie',
      'password',
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
      extnames: ['jpg', 'png', 'jpeg'],
    })

    await Database.transaction(async (trx) => {
      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move(Application.publicPath('company'), {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })

      const company = new Company()
      company.fill({ ...dataCompany, avatar: avatar?.fileName, confirmed: false })
      company.useTransaction(trx)
      await company.save()

      await (await User.create({
        name: company.company_name,
        email: company.email,
        password: dataCompany.password,
        phone: dataCompany.phone,
        avatar: avatar?.fileName,
        city_id: dataCompany.city_id,
        access_level: 2
      })).useTransaction(trx)

      let services = dataService.split(',').map((data) => ({
        id: uuidv5(DateTime.now().toString() + Math.random(), Env.get('UUID_NAMESPACE')),
        company_id: company.id,
        service_id: data,
        created_at: DateTime.now(),
      }))

      if (dataService)
        await Database.table('company_services').multiInsert(services).useTransaction(trx)

      response.status(200).send('Empresa cadastrada com sucesso!')
    }).catch((error) => {
      response.status(400).send('Erro: ' + error)
    })
  }

  public async store({ request, response }: HttpContextContract) {
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
      extnames: ['jpg', 'png', 'jpeg'],
    })

    await Database.transaction(async (trx) => {
      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move(Application.publicPath('company'), {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })

      const company = new Company()
      company.fill({ ...dataCompany, avatar: avatar?.fileName, confirmed: true  })
      company.useTransaction(trx)
      await company.save()

      let services = dataService.split(',').map((data) => ({
        id: uuidv5(DateTime.now().toString() + Math.random(), Env.get('UUID_NAMESPACE')),
        company_id: company.id,
        service_id: data,
        created_at: DateTime.now(),
      }))

      if (dataService)
        await Database.table('company_services').multiInsert(services).useTransaction(trx)

      response.status(200).send('Empresa cadastrada com sucesso!')
    }).catch((error) => {
      response.status(400).send('Erro: ' + error)
    })
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const company = await Company.findOrFail(params.id)
      const services = await CompanyService.query().where('company_id', params.id)
      return { ...company.toJSON(), services: services }
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
        extnames: ['jpg', 'png', 'jpeg'],
      })

      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move(Application.publicPath('company'), {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })

      console.log(dataCompany)
      const company = await (await Company.findOrFail(params.id))
        .merge(dataCompany)
        .useTransaction(trx)
        .save()
      await CompanyService.query().where('company_id', params.id).whereNull('deleted_at').delete()

      let dtServices = dataService.split(',').map((data) => ({
        id: uuidv5(DateTime.now().toString() + Math.random(), Env.get('UUID_NAMESPACE')),
        company_id: company.id,
        service_id: data,
        created_at: DateTime.now(),
      }))

      await Database.table('company_services').multiInsert(dtServices).useTransaction(trx)

      response.status(200).send('Empresa atualizada com sucesso!')
    }).catch((error) => {
      console.log(error)
      response.status(400).send('Erro: ' + error)
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const data = { deleted_at: DateTime.now() }
    await Database.transaction(async (trx) => {
      await (await Company.findOrFail(params.id)).merge(data).useTransaction(trx).save()
      const services = await CompanyService.query()
        .where('company_id', params.id)
        .whereNull('deleted_at')

      services.map(async (data) => {
        await (await CompanyService.findOrFail(data.id)).merge(data).useTransaction(trx).save()
      })

      response.status(200).send('Empresa excluida com sucesso!')
    }).catch((error) => {
      response.status(400).send('Erro: ' + error)
    })
  }
}
