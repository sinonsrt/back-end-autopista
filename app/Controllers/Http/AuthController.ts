import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')
      const token = await auth.attempt(email, password, {
        expiresIn: '2h',
      })

      const user = await User.findOrFail(auth.user?.id)

      if (token) {
        return { token, user }
      }
    } catch (error) {
      response.status(400).send('E-mail ou senha incorretos!')
    }
  }
}
