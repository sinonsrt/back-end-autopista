import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import md5 from 'md5'
import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import random from 'random'
export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const { search } = request.all()
    try {
      const users = User.query().whereNull('deleted_at').preload('city', query => query.preload('state'))
      if (search) users.andWhere(query => query.orWhere('name', 'ILIKE', '%' + search + '%').orWhere('email', 'ILIKE', '%' + search + '%'))
      return await users
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['name', 'email', 'password', 'phone', 'city_id'])
      let email = ''
      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move('assets/images/avatar', {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })

      await User.create({ ...data, avatar: avatar?.fileName, access_level: 3, confirmed: true })

      await Mail.send((message) => {
        message
          .from(`${Env.get('SMTP_USERNAME')}`)
          .to(data.email)
          .subject('Bem-vindo ao AutoPista').html(`
              <h1> Seja bem-vindo, ${data.name}. </h1> <br>
              <h2> Seu cadastrado foi confirmado e realizado com sucesso! </h2>`)
      })

      response.status(200).send(`Foi enviado um email para ${data.email}, verifique se seu cadastro foi aprovado!`)
    } catch (error) {
      response.status(400).send('Error ao cadastrar: ' + error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'name',
        'email',
        'password',
        'phone',
        'city_id',
        'access_level',
        'avatar',
      ])

      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move(Application.publicPath('avatar'), {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })
      await User.create({ ...data, avatar: avatar?.fileName, access_level: 2 })

      response.status(200).send(`Usuário cadastrado com sucesso!`)
    } catch (err) {
      response.status(406).send('ERROR 008: ' + err)
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      return user
    } catch (err) {
      response.status(406).send('ERROR 008: ' + err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = request.only(['name', 'title', 'description', 'link', 'avatar'])
      const user = await User.findOrFail(params.id)

      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      if (avatar?.hasErrors) {
        return avatar.errors
      }

      await avatar?.move('assets/images/news', {
        name: `${md5([`${DateTime.now()}`, `${avatar.clientName}`])}` + `.${avatar.extname}`,
      })

      user.merge({ ...data, avatar: avatar?.fileName })
      user.save()

      response.status(200).send('Dados de usuário atualizado com sucesso!')
    } catch (error) {
      response.status(400).send('Erro: ' + error)
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      const data = { deletedAt: DateTime.now() }
      user.merge(data)
      await user.save()

      return response.status(200).send('Usuário deletado com sucesso!')
    } catch (err) {
      response.status(406).send('ERROR 004: ' + err)
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    try {
      await auth.logout()
      response.status(200).send('Usuário desconectado com sucesso!')
    } catch (err) {
      response.status(400).send('Erro ao realizar logout: ' + err)
    }
  }

  public async changePassword({ request, auth, response, params }: HttpContextContract) {
    try {
      const id = params.id
      const { current_password, new_password } = request.only([
        'current_password',
        'new_password',
      ])

      const email = (await User.findOrFail(id)).email
      const user = await auth.verifyCredentials(email, current_password)

      user.password = new_password
      await user.save()

      response.status(200).send('Alterado com sucesso!')
    } catch (error) {
      response.status(400).send('ERROR: ' + error)
    }
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const user = await User.findByOrFail('email', request.input('email'))

    if (user) {
      const newPassword = random.integer(0, 99999).toString()
      user.password = newPassword
      await user.save()

      Mail.sendLater((message) => {
        message
          .from(`${Env.get('SMTP_USERNAME')}`)
          .to(user.email)
          .subject('Redefinição de senha.').html(`
            <p>Olá, ${user.name}. Recebemos sua solicitação para redefinir sua senha. Utilize suas novas credenciais para acessar o sistema:</p>
            <p>E-mail: <strong>${user.email}</strong></p>
            <p>Senha: <strong>${newPassword}</strong></p>
            `)
      })

      response
        .status(200)
        .send(`E-mail para redefinição de senha enviado ao endereço ${user.email}`)
    } else {
      response.status(400).send('Usuário não encontrado!')
    }
  }
}
