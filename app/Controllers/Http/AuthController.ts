import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')

      const user = await User.findByOrFail("email", email)
      if(!user.confirmed) response.status(400).send('Usuário não confirmado!')
      const token = await auth.attempt(email, password, {
        expiresIn: '2h',
      })

      await user.load('city')
      if(user.company_id) await user.load('company')

      if (token) {
        return { token, user }
      }
    } catch (error) {
      response.status(400).send('E-mail ou senha incorretos!')
    }
  }
}
