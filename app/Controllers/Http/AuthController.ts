import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from "App/Models/User"

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input("email")
    const password = request.input("password")

    const token = await auth.attempt(email, password, {
      expiresIn: "2h",
    })

    if(token){
      const user = await User.findOrFail(auth.user?.id)

      return { token, user }
    } else {
      response
        .status(400)
        .send('Usuário incorreto!')
    }
    return token.toJSON()
  }
}

