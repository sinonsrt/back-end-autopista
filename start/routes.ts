/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/login', 'AuthController.login')
Route.post('/register', 'UsersController.register')

Route.group(() => {
  Route.resource('/accesslevel', 'AccessLevelsController')
  Route.resource('/user', 'UsersController')
  Route.resource('/coments', 'ComentsController')
  Route.resource('/services', 'ServicesController')
  Route.resource('/gas', 'GasServicesController')
  Route.resource('/companies', 'CompaniesController')
  Route.resource('/types', 'TypesController')
  Route.resource('/news', 'NewsController')
  Route.post('/logout', 'UsersController.logout')
  Route.post('/codeComent', 'ComentsController.codeComent')
}).middleware(['auth'])
