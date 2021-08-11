import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Code from 'App/Models/Code'
import Company from 'App/Models/Company'
import UserCode from 'App/Models/UserCode'
import { DateTime } from 'luxon'

export default class UserCodesController {
  public async index({ request, response, auth }: HttpContextContract) {
    const { order, type, search } = request.all()
    try {
      const userCodes = Database.from('user_codes')
        .select('user_codes.*', 'users.name', 'codes.code', 'companies.company_name')
        .whereNull('user_codes.deleted_at')
        .join('users', 'user_codes.user_id', 'users.id')
        .join('codes', 'user_codes.code_id', 'codes.id')
        .join('companies', 'user_codes.company_id', 'companies.id')
      if (search)
        userCodes.andWhere((query) =>
          query
            .orWhere('codes.code', 'ILIKE', '%' + search + '%')
            .orWhere('users.name', 'ILIKE', '%' + search + '%')
            .orWhere('companies.company_name', 'ILIKE', '%' + search + '%')
        )
      return await userCodes.orderBy(order, type)
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async indexAll({ request, response, auth }: HttpContextContract) {
    const { order, type } = request.all()
    try {
      const userCodes = Database.from('user_codes')
        .select('user_codes.*', 'codes.code', 'companies.company_name', 'users.name')
        .whereNull('user_codes.deleted_at')
        .join('users', 'user_codes.user_id', 'users.id')
        .join('codes', 'user_codes.code_id', 'codes.id')
        .join('companies', 'user_codes.company_id', 'companies.id')
        .where('user_codes.user_id', `${auth.user?.id}`)
      return await userCodes.orderByRaw(`user_codes.${order} ${type}`)
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const data = request.only(['comment', 'star', 'code'])

      if (auth.user?.access_level !== 3)
        throw new Error('Apenas usuários podem realizar a avaliação!')

      const code = await Code.findByOrFail('code', data.code)
      if (code.code) {
        await (
          await UserCode.create({
            comment: data.comment,
            star: data.star,
            company_id: code.company_id,
            code_id: code.id,
            user_id: auth.user?.id,
          })
        ).useTransaction(trx)

        const company = await Company.findOrFail(code.company_id)
        const stars = data.star / 80
        await company
          .merge({ stars: stars + company.stars })
          .useTransaction(trx)
          .save()

        response.status(200).send('Avaliação cadastrada com sucesso!')
      } else {
        throw new Error('Cupôm avaliativo inválido ou expirado!')
      }
    }).catch((error) => {
      response.status(400).send('Erro: ' + error)
    })
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      return await UserCode.findOrFail(params.id)
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = request.only(['comment', 'code_id', 'star', 'company_id'])
      await (await UserCode.findOrFail(params.id)).merge(data).save()

      const company = await Company.findOrFail(data.company_id)
      const documentsValue = ((company.stars + data.star) / company.stars) * 5
      company.merge({ stars: documentsValue }).save()

      response.status(200).send('Avaliação atualizado com sucesso!')
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      await (await UserCode.findOrFail(params.id)).merge({ deleted_at: DateTime.now() }).save()
      response.status(200).send('Avaliação excluída com sucesso!')
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }
}
