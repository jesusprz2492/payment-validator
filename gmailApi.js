const dotenv = require('dotenv')
const {google} = require('googleapis');
const fetch = require("node-fetch");
const {authenticate} = require('@google-cloud/local-auth');
dotenv.config()


const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};

const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
);
oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

async function getMessages() {
  let messagesId = [];
  let subjets = [];
  let dataList = {};
  let data;
  let messageId; 
  let ammount; 
  let sender; 
  let date;

  const gmail = google.gmail({version: 'v1', auth:oauth2Client});
  await gmail.users.messages.list({
    userId: 'inmerca@gmail.com',
    labelIds: 'UNREAD',
    q: 'no-reply@alertsp.chase.com'
  })
  .then (result => {
    if(result.data.messages){
      result.data.messages.forEach(message => {
        messagesId.push(message.id);
      });
    }else{
      console.log('No new messages');
    } 
    
  })
  .then( () => {
    messagesId.forEach(id => {
      gmail.users.messages.get({
        "userId": "inmerca@gmail.com",
        "id": `${id}`,
        "format": "metadata",
        "metadataHeaders": "subject"
      })
      .then(async result =>{
        await gmail.users.messages.modify({
          "userId": "inmerca@gmail.com",
          "id": `${result.data.id}`,
          "resource": {
            "removeLabelIds": [
              "UNREAD"
            ]
          }
        })
        let mailDate = new Date(parseInt(result.data.internalDate)).toLocaleString("es-VE")
        subjets.push(result.data.id+" "+result.data.payload.headers[0].value+" "+mailDate);
        
        data = subjets[subjets.length -1].split("\n");
        //console.log(data)
        let expReg = /([a-z\w\d]+)\b([A-Z\s\w]+) te envió \$([\d\.,]*) ([\d/,]+[\d:\w\s\.]+)/g

        data.forEach(item =>{
          //console.log(item);
          result = expReg.exec(item);

          if(result[3].match(',') == null)
            ammount = result[3];
          else  
            ammount  = result[3].replace(",","");

          messageId = result[1];
          sender = result[2];
          date = result[4];

          dataList = {"id": messageId, "sender": sender, "ammount": ammount, "date":date, "receiver":'inmerca@gmail.com'};
          fetch("https://mayor28zellevalidator.azurewebsites.net/data", {
            method: 'POST',
            headers: {
              'content-type':'application/json'
            },
            body:JSON.stringify(dataList)
          }).then(response  => {console.log(response)})
        });
      })
      })
    })
}
getMessages()