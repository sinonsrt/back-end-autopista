import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Company from 'App/Models/Company'
import User from 'App/Models/User'
import { v5 as uuidv5 } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import md5 from 'md5'
import { DateTime } from 'luxon'

export default class CompaniesController {
  public async index ({}: HttpContextContract) {
  }

  public async store ({ request, response }: HttpContextContract) {
    try{
      await Database.transaction(async (trx)=> {

        const dataUser = request.only([
          'email',
          'password',
          'phone',
          'city_id',
        ])

        const dataCompany = request.only([
          'company_name',
          'corporate_name',
          'cnpj',
          'ie',
          'cep',
          'district',
          'number',
          'stars',
          'start_time',
          'end_time',
          'worked_days',
          'service_id',
          'service_gas_id',
          'type_id',
        ])

        const user = new User()
        user.fill({...dataUser, access_level: 2})
        user.useTransaction(trx)
        await user.save()


        const company = new Company()
        company.fill({...dataCompany, user_id: user.id, phone: user.phone, city_id: user.city_id})
        company.useTransaction(trx)
        await company.save()

        const dtImage = new Array()
        const dataImage = request.file('image', {
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        })

        if (dataImage?.hasErrors) {
          return dataImage.errors
        }

        await dataImage?.move(('assest/images/company'), {
          name: `${md5([`${DateTime.now()}`, `${dataImage.clientName}`])}`+`.${dataImage.extname}`
        })

        dtImage.push({
          id: uuidv5(dataImage?.fileName + company.id, Env.get('UUID_NAMESPACE')),
          company_id: company.id,
          image: dataImage?.fileName
        })
        await Database.table('company_images').multiInsert(dtImage).useTransaction(trx)


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

  public async show ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
