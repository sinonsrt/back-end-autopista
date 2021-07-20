import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ejs from 'ejs'
import path from 'path'
import pdf from 'html-pdf'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'

export default class ReportsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const name = `report${new Date().toISOString().replace(/[^0-9]/g, '')}.pdf`
      const filePath = path.join('resources', 'views', 'reports', 'cteReport.ejs')
      const options = {
        format: 'A4',
        orientation: 'landscape',
        header: {
          contents: `
              <div style="margin-top: -25px; font-family: Open Sans, Arial, Tahoma sans-serif;">
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
                  <p> Emitido através do sistema MS1-Transportes - ${DateTime.now().toFormat(
                    'dd/LL/yyyy - HH:mm'
                  )}</p>
              </div>
            `,
        },
      }
      const render = await ejs.renderFile(filePath, {
        
      })

      await pdf
        .create(render, options)
        .toFile(Application.publicPath(path.join('reports', name)), (error) => {
          if (error) {
            response.status(400).send('ERROR 008: ' + error)
          }
        })

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms, ''))
      await sleep(2000)

      response.status(200).send(name)
    } catch (err) {
      response.status(400).send('ERROR: ' + err)
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
