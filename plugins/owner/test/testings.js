import fs from 'node:fs'

export const run = {
   usage: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'],
   async: async (m, {
      client,
      command,
      Config,
      Utils,
      setting
   }) => {
      try {
         await client.sendReact(m.chat, setting.timeLoad, m.key)

         if (command === 'test1') {
            client.sendMetaMsg(m.chat, [{
               text: `Hola @${m.sender.replace(/@.+/, '')} este es un mensaje de prueba.\n\nProbando rich Messages...`
            },
            {
               code: {
                  language: 'javascript',
                  code: fs.readFileSync('./not.js', 'utf-8')
               }
            },
            {
               text: `Tambla de ejemplo.`
            },
            {
               table: {
                  title: 'Data',
                  headers: ['titulo 1', 'titulo 2'],
                  rows: [
                     ['test 1', 'test 2'],
                     ['test 3', `test 4`]
                  ]
               }
            }, {
               text: 'Xddd'
            },], m, {
               title: setting.botDesc,
               mentions: [m.sender]
            })
         }

         if (command === 'test2') {
            client.sendMetaMsg(m.chat, [
               {
                  text: `Mensaje de prueba, ahora compatible con textos con link, por ejemplo : [Delirius](https://api.delirius.online)`
               },
               {
                  code: {
                     language: 'javascript',
                     code: fs.readFileSync('./not.js', 'utf-8')
                  }
               },
               {
                  table: {
                     title: 'Farguts',
                     headers: ['titulo 1', 'titulo 2'],
                     rows: [
                        ['test 1', 'test 2'],
                        ['test 3', 'test 4']
                     ]
                  }
               },
               {
                  muted: 'Tambien hay otras funciones como:'
               },
               {
                  suggestions: {
                     list: ['FARGUTS', 'ASSETS', 'JAIME']
                  }
               },
               {
                  suggestions: {
                     type: 2,
                     list: 'ASSETS BOT'.replace(' ', '').split('')
                  }
               },
               {
                  suggestions: {
                     type: 1,
                     list: 'ASSETS BOT'
                  }
               },
               {
                  sources: [{
                     icon: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     title: 'GitHub',
                     url: 'https://github.com/nulswa'
                  }]
               }], m, {
               title: setting.botDesc
            })
         }

         if (command === 'test3') {
            client.sendMetaMsg(m.chat, [
               {
                  text: 'Este es un mensaje de prueba.\n\n---\n\nSoporte para reels:'
               },
               {
                  reels: [
                     'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg'
                  ].map(image => ({
                     creator: 'Farguts Native',
                     avatar: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     verified: true,
                     thumbnail: image,
                     url: 'https://github.com/nulswa',
                     source: 'IG'
                  }))
               },
               {
                  text: '\n\n---\n\nTambien compatible con post:'
               },
               {
                  posts: [{
                     media: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     caption: 'Descripcion 1',
                     source: 'FACEBOOK'
                  }, {
                     media: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     caption: 'Descripcion 2',
                     source: 'THREADS'
                  }, {
                     media: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     caption: 'Descripcion 3',
                     source: 'INSTAGRAM'
                  }].map(v => ({
                     username: 'Farguts Native',
                     avatar: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     verified: true,
                     caption: v.caption,
                     url: 'https://github.com/nuslwa',
                     thumbnail: v.media,
                     source: v.source,
                     post_type: 'PHOTO'
                  }))
               },
               {
                  text: '\n\n---\n\nO bien, con productos:\n\n'
               },
               {
                  products: {
                     title: 'Producto gratis',
                     image: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     sale_price: 'ARS. 0.00',
                     brand: '@rodrec',
                     url: `https://wa.me/${Config.owner}`
                  }
               },
               {
                  text: '\n'
               },
               {
                  products: {
                     title: 'Producto 1',
                     image: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     sale_price: 'ARS. 10.000',
                     brand: '@nami_harumi',
                     url: `https://wa.me/${Config.owner}`
                  }
               },
               {
                  text: '\n\n---\n\nO también está versión de productos:'
               },
               {
                  products: [{
                     title: 'Producto gratis',
                     image: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     sale_price: 'ARS 0.00'
                  }, {
                     title: 'Producto 1',
                     image: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     price: 'ARS. 2.000',
                     sale_price: 'ARS. 1.000'
                  }, {
                     title: 'Producto 2',
                     image: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     sale_price: 'ARS. 23.000'
                  }, {
                     title: 'Producto 3',
                     image: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                     sale_price: 'ARS. 4.000'
                  }].map(v => ({
                     ...v,
                     brand: 'Farguts Native',
                     url: `https://wa.me/${Config.owner}`
                  }))
               }], m, {
               title: setting.botDesc
            })
         }

         if (command === 'test4') {
            const mediaId = `art?t=${Date.now()}`
            const edit = [{
               delay: 15000,
               data: [{
                  video: 'https://v1.pinimg.com/videos/iht/expMp4/d1/31/01/d13101277a12e62be6a0849895af9347_720w.mp4',
                  replace: mediaId
               }]
            }]

            client.sendMetaMsg(m.chat, [{
               video: '',
               status: 'GENERATING',
               estimatedTime: 15000,
               id: mediaId
            }], m, { edit })
         }

         if (command === 'test5') {
            let caption = 'Mensaje de prueba, básicamente.  :).'
            const mediaId = `art?t=${Date.now()}`
            const words = caption.trim().split(/\s+/)

            const edit = [{
               delay: 15000,
               data: [{
                  image: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
                  replace: mediaId,
               }, {
                  text: words[0],
                  replace: 'status'
               }]
            },
            ...words.slice(1).map((_, i) => ({
               delay: 400,
               data: [{
                  text: words.slice(0, i + 2).join(' '),
                  replace: 'status'
               }]
            }))]

            client.sendMetaMsg(m.chat, [{
               video: '',
               status: 'GENERATING',
               estimatedTime: 15000,
               id: mediaId
            }, {
               text: 'Procesando...',
               id: 'status',
            }], m, { edit })
         }

         if (command === 'test6') {
            client.sendMetaMsg(m.chat, [{
               id: 'game',
               html: {
                  payload: fs.readFileSync('./core/games/game.html'),
                  trusted_sources: ['mochi'],
               },
            }], m, {
               title: 'mochi versión rc14 :)',
               bypassDownload: true
            })
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
