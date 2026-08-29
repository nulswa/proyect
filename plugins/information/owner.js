export const run = {
usage: ['owner'],
category: 'information',
async: async (m, { client, Config, setting }) => {
client.sendIAMessage(m.chat, [{
name: 'booking_confirmation',
buttonParamsJson: JSON.stringify({
start_datetime: generateDateTimes().start_datetime,
end_datetime: generateDateTimes().end_datetime,
location: 'Argentina',
booking_url: setting.web,
phone_number: String('5493873655135'),
bookingmanagementurl: setting.web,
description: 'Contact me for suggestions, issues, or just questions.  :)',
email: 'toriprincipalmark@gmail.com',
display_text: 'click'
})
}], m, {
header: setting.botName,
content: `¡Hi @${m.sender.split('@')[0]}!\n\n${setting.emoji2}  *Contact me for suggestions, issues, or just questions.*  :)`
})
},
   error: false
}

function generateDateTimes(durationMinutes = 10) {
   const start = new Date()
   const end = new Date(start.getTime() + durationMinutes * 60000)

   return {
      start_datetime: start.toISOString(),
      end_datetime: end.toISOString()
   }
}