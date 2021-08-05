import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Code from 'App/Models/Code'
import { DateTime } from 'luxon'

export default class CodesController {
  public async index ({ request, response }: HttpContextContract) {
    const { search } = request.all()
    try{
      const codes = Code.query().whereNull('deleted_at').preload('company')
      if(search) codes.where('code', 'ILIKE', '%' + search + '%')
      return await codes
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async store ({ request, response, auth }: HttpContextContract) {
    try{
      const data = request.only(['code', 'company_id'])
      await Code.create({...data, user_id: auth.user?.id})

      response
        .status(200)
        .send('Código bônus cadastrado com sucesso!')
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try{
      const data = request.only(['code', 'company_id'])
      const code = await Code.findOrFail(params.id)
      code.merge(data)
      code.save()

      response
        .status(200)
        .send('Código bônus atualizado com sucesso!')
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const code = await Code.findOrFail(params.id)
      const data = { deleted_at: DateTime.now() }
      code.merge(data)
      await code.save()

      return response
        .status(200)
        .send('Código bônus com sucesso!')
    } catch(error) {
      response
        .status(406)
        .send('Erro: ' + error)
    }
  }
}
