import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import md5 from 'md5'

export default class UsersController {
  public async index ({ response }: HttpContextContract) {
    try{
      const users = await User.query().whereNull('deleted_at')
      return users
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async register({ request, response}: HttpContextContract) {
    try{
      await Database.transaction(async (trx) =>{
        const data = request.only(['email', 'password', 'phone', 'city_id', 'access_level', 'avatar'])
        const user = new User()

        const avatar = request.file('avatar', {
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg']
        })

        if(avatar?.hasErrors){
          return avatar.errors
        }

        await avatar?.move(('assets/images/avatar'), {
          name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}`+`.${avatar.extname}`
        })

        user.fill({ ...data, avatar: avatar?.fileName })
        user.useTransaction(trx)
        await user.save()

        response
          .status(200)
          .send('Usuário cadastrado com sucesso!')
        })
    }catch(error){
      response
        .status(400)
        .send('Error ao cadastrar: ' + error)
    }
  }

  public async show ({ response, params }: HttpContextContract) {
    try{
      const user = await User.findOrFail(params.id)
      return user
    } catch(err){
      response
        .status(406)
        .send('ERROR 008: ' + err)
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try{
      const data = request.only(['title', 'description', 'link', 'avatar'])
      const user = await User.findOrFail(params.id)

      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      })

      if(avatar?.hasErrors){
        return avatar.errors
      }

      await avatar?.move(('assets/images/news'), {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}`+`.${avatar.extname}`
      })

      user.merge({...data, avatar: avatar?.fileName })
      user.save()

      response
        .status(200)
        .send('Dados de usuário atualizado com sucesso!')

    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const user = await User.findOrFail(params.id)
      const data = { deletedAt: DateTime.now() }
      user.merge(data)
      await user.save()

      return response
        .status(200)
        .send('Usuário deletado com sucesso!')
    } catch(err) {
      response
        .status(406)
        .send('ERROR 004: ' + err)
    }
  }

  public async logout({ response, auth }: HttpContextContract){
    try{
      await auth.logout()
      response
      .status(200)
      .send('Usuário desconectado com sucesso!')
    } catch(err){
      response
      .status(400)
      .send('Erro ao realizar logout: ' + err)
    }
  }
}
