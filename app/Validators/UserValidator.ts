import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
        name: schema.string({}, [
		]),
        email: schema.string({}, [
			rules.unique({
				column: 'email',
				table: 'users'
			})
		]),
        phone: schema.string({}, [
		]),
        city_id: schema.string({}, [
		]),
  })

  public messages = {}
}
