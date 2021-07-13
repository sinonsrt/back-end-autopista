import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Company from 'App/Models/Company'
import { DateTime } from 'luxon'

export default class CompaniesController {
  public async index ({ response }: HttpContextContract) {
    try{
      const companies = await Company.query().whereNull('deleted_at')
      return companies
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async store ({ request, response }: HttpContextContract) {
    try{
      await Database.transaction(async (trx)=> {
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
          'stars',
          'start_time',
          'end_time',
          'worked_days',
          'service_id',
          'service_gas_id',
          'type_id',
          'city_id',
          'email'
        ])


        const company = new Company()
        company.fill({...dataCompany})
        company.useTransaction(trx)
        await company.save()

        const dtImage = new Array()
        /* const dataImage = request.file('image', {
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        })

        if (dataImage?.hasErrors) {
          return dataImage.errors
        }

        await dataImage?.move(('assets/images/company'), {
          name: `${md5([`${DateTime.now()}`, `${dataImage.clientName}`])}`+`.${dataImage.extname}`
        })

        dtImage.push({
          id: uuidv5(dataImage?.fileName + company.id, Env.get('UUID_NAMESPACE')),
          company_id: company.id,
          image: dataImage?.fileName
        })
        await Database.table('company_images').multiInsert(dtImage).useTransaction(trx) */


        response
          .status(200)
          .send('Empresa cadastrada com sucesso!')

      })
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async show ({ response, params }: HttpContextContract) {
    try{
      const company = await Company.findOrFail(params.id)

      return company
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try{
      const data = request.only([
        'company_name',
        'corporate_name',
        'cnpj',
        'ie',
        'cep',
        'address',
        'phone',
        'district',
        'number',
        'stars',
        'start_time',
        'end_time',
        'worked_days',
        'service_id',
        'service_gas_id',
        'type_id',
        'city_id',
        'email'
      ])

      const company = await Company.findOrFail(params.id)
      await company.merge(data)
      company.save()

      response
        .status(200)
        .send('Dados atualizados com sucesso!')
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const data = { deleted_at: DateTime.now() }
      const company = await Company.findOrFail(params.id)

      company.merge(data)
      company.save()

      response
        .status(200)
        .send('Empresa excluida com sucesso!')

    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }
}
