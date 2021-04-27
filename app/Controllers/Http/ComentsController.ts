import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Coment from 'App/Models/Coment'
import { DateTime } from 'luxon'

export default class ComentsController {
  public async index ({ response }: HttpContextContract) {
    try{
      const coments = await Coment.query().preload('company').preload('user').whereNull('deleted_at')

      return coments
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async store ({ request, response, auth, params }: HttpContextContract) {
    try{
      await Database.transaction(async(trx) =>{
        const coment = new Coment()
        const data = request.only(['content'])

        const user = auth.user?.id

        coment.fill({...data, user_id: user, company_id: params.id})
        console.log(coment)

        response
          .status(200)
          .send('Comentário enviado com sucesso! Obrigado!')
      })
    }catch(error){
      response
        .status(400)
        .send(error)
    }
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const data = {
        deleted_at: DateTime.now()
      }
      const coment = await Coment.findOrFail(params.id)

      coment.merge(data)
      coment.save()

      response
        .status(200)
        .send('Comentário excluido com sucesso!')
    } catch(error){
      response
        .status(error.status)
        .send('Erro: ' + error)
    }
  }
}
