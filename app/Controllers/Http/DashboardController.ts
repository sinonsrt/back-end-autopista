import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Company from 'App/Models/Company'
import User from 'App/Models/User'

export default class TypesController {
  public async index({ response }: HttpContextContract) {
    try {
      const company = await Company.query().count('*').whereNull('deleted_at')
      const service = await Database.rawQuery("select count(*) from companies left join types on companies.type_id = types.id WHERE companies.deleted_at IS NULL AND types.description = 'Prestador de serviço'")
      const user = await User.query().count('*').whereNull('deleted_at')
      
      return {
        company: company[0].count,
        service: service.rows[0].count,
        user: user[0].count
      }
    } catch (error) {
      response.status(400).send('ERROR: ' + error)
    }
  }
}
