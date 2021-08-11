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
  return { hello: 'AutoPista' }
})

Route.post('/login', 'AuthController.login')
Route.post('/register', 'UsersController.register')
Route.post('/logout', 'UsersController.logout')
Route.post('/resetPassword', 'UsersController.resetPassword')
Route.put('/changePassword/:id', 'UsersController.changePassword')
Route.resource('/cities', 'CitiesController')
Route.get('/dashboard', 'DashboardController.index')
Route.resource('/accesslevel', 'AccessLevelsController')

Route.group(() => {
  Route.get('/userCodesAll', 'UserCodesController.indexAll')
  Route.resource('/userCodes', 'UserCodesController')
  Route.resource('/codes', 'CodesController')
  Route.resource('/workedDays', 'WorkedDaysController').only(['store', 'show', 'update', 'destroy'])
  Route.resource('/workedTimes', 'WorkedTimesController').only(['store', 'show', 'update', 'destroy'])
  Route.resource('/companies', 'CompaniesController')
  Route.resource('/newsPaper', 'NewsController')
  Route.resource('/services', 'ServicesController').only(['store', 'show', 'update', 'destroy'])
  Route.resource('/types', 'TypesController').only(['store', 'show', 'update', 'destroy'])
  Route.resource('/users', 'UsersController')
  Route.get('/companyConfirm/:id', 'CompaniesController.companyConfirm')
  Route.get('/companyReports', 'ReportsController.index')
  Route.get('/userReports', 'ReportsController.show')
  Route.get('/ratingReports', 'ReportsController.ratingReports')
}).middleware(['auth'])

Route.resource('/services', 'ServicesController').only(['index'])
Route.resource('/workedDays', 'WorkedDaysController').only(['index'])
Route.resource('/workedTimes', 'WorkedTimesController').only(['index'])
Route.post('/companyRegister', 'CompaniesController.companyRegister')
Route.resource('/types', 'TypesController').only(['index'])