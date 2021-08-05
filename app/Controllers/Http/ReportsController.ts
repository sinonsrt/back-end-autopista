import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ejs from 'ejs'
import path from 'path'
import pdf from 'html-pdf'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ReportsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const { type, confirmed } = request.all()

      const companies = Database.from('companies')
        .select('companies.*', 'types.id as type_id', 'types.description')
        .whereNull('companies.deleted_at')
        .join('types', 'companies.type_id', 'types.id')

      if (type) companies.where('types.description', type)
      if (confirmed) companies.where('confirmed', false)

      const data = await companies.orderBy('companies.id', 'asc')

      if (!data[0]) {
        response.status(404).send('Consulta não encontrada!')
      } else {
        const name = `company${new Date().toISOString().replace(/[^0-9]/g, '')}.pdf`
        const filePath = path.join('resources', 'views', 'reports', 'CompanyReport.ejs')
        const options = {
          format: 'A4',
          orientation: 'landscape',
          header: {
            contents: `
                <div style="margin-top: -10px; font-family: Open Sans, Arial, Tahoma sans-serif;">
                    <p>Sistema Auto-Pista</p>
                    <div class="page">
                        <p> Página: {{page}} de {{pages}} </p>
                        <p>
                            <b>${DateTime.now().toFormat('dd/LL/yyyy - HH:mm')}</b>
                        </p>
                    </div>
                </div>
              `,
          },
          footer: {
            height: '15mm',
            contents: `
                <div style="font-family: Open Sans, Arial, Tahoma sans-serif; text-align: center;">
                    <p> Emitido através do sistema AutoPista - ${DateTime.now().toFormat(
                      'dd/LL/yyyy - HH:mm'
                    )}</p>
                </div>
              `,
          },
        }

        const render = await ejs.renderFile(filePath, {
          data,
          type: type,
          confirmed: confirmed,
        })

        await pdf
          .create(render, options)
          .toFile(Application.publicPath(path.join('companyReport', name)), (error) => {
            if (error) {
              response.status(400).send('ERROR 008: ' + error)
            }
          })
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        await delay(2000)
        response.status(200).send(`companyReport/${name}`)
      }
    } catch (err) {
      response.status(400).send('ERROR: ' + err)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { confirmed } = request.all()

      const users = Database.from('users')
        .select('users.*', 'access_levels.id as access_level_id', 'access_levels.description')
        .whereNull('users.deleted_at')
        .join('access_levels', 'users.access_level', 'access_levels.id')

      if (confirmed) users.where('confirmed', confirmed)

      const data = await users.orderBy('users.id', 'asc')

      if (!data[0]) {
        response.status(404).send('Consulta não encontrada!')
      } else {
        const name = `user${new Date().toISOString().replace(/[^0-9]/g, '')}.pdf`
        const filePath = path.join('resources', 'views', 'reports', 'UserReport.ejs')
        const options = {
          format: 'A4',
          orientation: 'landscape',
          header: {
            contents: `
                <div style="margin-top: 1-0px; font-family: Open Sans, Arial, Tahoma sans-serif;">
                    <p>Sistema Auto-Pista</p>
                    <div class="page">
                        <p> Página: {{page}} de {{pages}} </p>
                        <p>
                            <b>${DateTime.now().toFormat('dd/LL/yyyy - HH:mm')}</b>
                        </p>
                    </div>
                </div>
              `,
          },
          footer: {
            height: '15mm',
            contents: `
                <div style="font-family: Open Sans, Arial, Tahoma sans-serif; text-align: center;">
                    <p> Emitido através do sistema AutoPista - ${DateTime.now().toFormat(
                      'dd/LL/yyyy - HH:mm'
                    )}</p>
                </div>
              `,
          },
        }

        const render = await ejs.renderFile(filePath, {
          data,
          confirmation: confirmed,
        })

         await pdf
          .create(render, options)
          .toFile(Application.publicPath(path.join('userReport', name)), (error) => {
            if (error) {
              response.status(400).send('ERROR 008: ' + error)
            }
          })
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        await delay(2000)
        response.status(200).send(`userReport/${name}`)
      }
    } catch (err) {
      response.status(400).send('ERROR: ' + err)
    }
  }
  
  public async ratingReports({ request, response }: HttpContextContract) {
    try {
      const companies = Database.from('companies')
        .select('companies.*', 'types.id as type_id', 'types.description')
        .whereNull('companies.deleted_at')
        .where('companies.stars', '>=', '3')
        .join('types', 'companies.type_id', 'types.id')

      const data = await companies.orderBy('companies.stars', 'asc')
      console.log(data)
      if (!data[0]) {
        response.status(404).send('Consulta não encontrada!')
      } else {
        const name = `rating${new Date().toISOString().replace(/[^0-9]/g, '')}.pdf`
        const filePath = path.join('resources', 'views', 'reports', 'RatingReport.ejs')
        const options = {
          format: 'A4',
          orientation: 'landscape',
          header: {
            contents: `
                <div style="margin-top: 1-0px; font-family: Open Sans, Arial, Tahoma sans-serif;">
                    <p>Sistema Auto-Pista</p>
                    <div class="page">
                        <p> Página: {{page}} de {{pages}} </p>
                        <p>
                            <b>${DateTime.now().toFormat('dd/LL/yyyy - HH:mm')}</b>
                        </p>
                    </div>
                </div>
              `,
          },
          footer: {
            height: '15mm',
            contents: `
                <div style="font-family: Open Sans, Arial, Tahoma sans-serif; text-align: center;">
                    <p> Emitido através do sistema AutoPista - ${DateTime.now().toFormat(
                      'dd/LL/yyyy - HH:mm'
                    )}</p>
                </div>
              `,
          },
        }

        const render = await ejs.renderFile(filePath, {
          data,
        })

        await pdf
          .create(render, options)
          .toFile(Application.publicPath(path.join('ratingReport', name)), (error) => {
            if (error) {
              response.status(400).send('ERROR 008: ' + error)
            }
          })
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        await delay(2000)
        response.status(200).send(`ratingReport/${name}`)
      }
    } catch (err) {
      response.status(400).send('ERROR: ' + err)
    }
  }
}
