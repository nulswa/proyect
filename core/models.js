export const models = {
   get users() {
      return {
         lid: null,
         afk: -1,
         afkReason: '',
         afkObj: {},
         banned: false,
         ban_temporary: 0,
         ban_times: 0,
         premium: false,
         expired: 0,
         lastseen: 0,
         hit: 0,
         warning: 0,
         example: []
      }
   },
   get groups() {
      return {
         activity: 0,
         antidelete: false,
         antilink: false,
         antivirtex: false,
         antitagsw: false,
         filter: false,
         left: false,
         localonly: false,
         mute: false,
         viewonce: false,
         autosticker: false,
         member: {},
         text_left: '',
         text_welcome: '',
         welcome: true,
         expired: 0,
         stay: false
      }
   },
   get chats() {
      return {
         chat: 0,
         lastchat: 0,
         lastseen: 0
      }
   },
   get setting() {
      return {
        autobackup: false,
         autodownload: false,
         antispam: false,
         debug: false,
         notifier: false,
         error: [],
         hidden: [],
         pluginDisable: [],
         receiver: [],
         groupmode: false,
         sk_pack: 'New Sticker',
         sk_author: 'Farguts',
         self: false,
         noprefix: false,
         multiprefix: true,
         prefix: ['_', '/', '+', '='],
         toxic: ["xnxx", "xvideos", "pornhub", "xhamster"],
         online: true,
         onlyprefix: '×',
         owners: ['5493876639332'],
         lastReset: new Date * 1,
         emoji: '📍',
         emoji2: '🍡',
         unlink: '~ El enlace ingresado no es válido.',
         nosear: '~ No se han encontrado resultados.',
         noapi: '~ La *API* no dio resultados.',
         sizeBot: '~ El archivo es demasiado pesado. No podrá ser enviado.',
         sucs: '*Success.*',
         erroBot: '~ Can\'t get metadata.',
         web: 'https://ko-fi.com/farguts',
         botName: '⸔ Mochi - もち ⸕',
         nameMark: 'Mochi',
         timeLoad: '⛩️',
         botDesc: 'もちツールキット *v3.0.0-rc.14*',
         dataBot: 'RedisDB',
         cliBot: '@WhiskeySockets/Baileys',
         toolks: '@mochi/toolkit',
         msg: '🍡  ¡Hola! +tag\n- Soy *Mochi*, un bot de *WhatsApp* que puede ser de utilidad al usuario. :)',
         waMenu: 'https://i.postimg.cc/Z5GcPnSv/WA-1786932310725.jpg',
         waImg: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
         style: 4,
         cover: 'https://i.postimg.cc/G3gvJtFf/91fa2f7b953260940b42fff8d87b4704.jpg',
         icon: 'https://i.postimg.cc/JnfcF28x/Chat-GPT-Image-5-sept-2026-12-28-11-p-m.png',
         link: 'https://ko-fi.com/farguts_native'
      }
   },
   get structure() {
      return { users: [], chats: [], groups: [], instance: [], statistic: {}, sticker: {}, setting: this.setting }
   }
}
