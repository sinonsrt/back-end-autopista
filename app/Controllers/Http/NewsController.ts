import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import News from 'App/Models/News'
import { DateTime } from 'luxon'
import md5 from 'md5'

export default class NewsController {
  public async index ({ response }: HttpContextContract) {
    try{
      const news = await News.query().whereNull('deleted_at')
      return news
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async store ({ request, response, auth }: HttpContextContract) {
    try{
      await Database.transaction(async (trx) => {
        const news = new News()
        const data = request.only(['title', 'description', 'link'])
        const userId = auth.user?.id

        const image = request.file('image', {
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg']
        })

        if(image?.hasErrors){
          return image.errors
        }

        await image?.move(('assets/images/news'), {
          name: `${md5([`${DateTime.now()}`, `${image.clientName}`])}`+`.${image.extname}`
        })

        news.fill({ ...data, user_id: userId, image: image?.fileName })
        news.useTransaction(trx)
        await news.save()

        response
        .status(200)
        .send("Noticía cadastrada com sucesso!")
      })
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async show ({ response, params }: HttpContextContract) {
    try{
      const showNew = await News.findOrFail(params.id)
      return showNew
    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try{
      const data = request.only(['title', 'description', 'link', 'image'])
      const showNew = await News.findOrFail(params.id)

      const image = request.file('image', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      })

      if(image?.hasErrors){
        return image.errors
      }

      await image?.move(('assets/images/news'), {
        name: `${md5([`${DateTime.now()}`, `${image.clientName}`])}`+`.${image.extname}`
      })

      showNew.merge({...data, image: image?.fileName })
      showNew.save()

      response
        .status(200)
        .send('Noticía atualizada com sucesso!')

    }catch(error){
      response
        .status(400)
        .send('Erro: ' + error)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try{
      const destroyNew = await News.findOrFail(params.id)
      const data = { deleted_at: DateTime.now() }
      destroyNew.merge(data)
      await destroyNew.save()

      return response
        .status(200)
        .send('Noticía deletada com sucesso!')
    } catch(error) {
      response
        .status(406)
        .send('Erro: ' + error)
    }
  }
}
