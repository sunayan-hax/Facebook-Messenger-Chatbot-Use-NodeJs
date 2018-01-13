'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a Pizza Delivery Chat Bot Application.")
})

let token = "ZwYCaBEAAB54jewV0MBAPoZCTd2CrXEREyj1UudekZCfPbm0ocRtZBOvLxHrpd8jULKrJZBxZCbKIZCt7KKiIgmJfLrLdBY0ncjUBtKRIBbBWG4ZC7eSi38em1ZBnQMRSi5TwHJgtYNLD3x65bbIZBwxzIIyhXi77JpI0M6L373dRAZBcdmhfLQZDZD"

// Facebook

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "pizza-demo") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			decideMessage(sender,text)
			//sendText(sender, "Text echo: " + text.substring(0, 100))
		}
		if(event.postback){
			let text=JSON.stringify(event.postback)
			decideMessage(sender,text)
			continue
		}
	}
	res.sendStatus(200)
})

function decideMessage(sender,text1){
	let text=text1.toLowerCase()
	if(text.includes("i would like to order two pizzas please"))
	{
		sendButtonMessage(sender,"what would you like to order?")
	}
	else if(text.includes("veg pizza"))
	{
		sendText(sender,"anything else sir!")
	}
	else if(text.includes("non veg pizza"))
	{
		sendText(sender,"anything else sir!")
	}
	else if(text.includes("nothing else."))
	{
		sendText(sender,"can i have your name and address please?")
	}
	else if(text.includes("sunayan das"))
	{
		sendText(sender,"and phone no.?")
	}
	else if(text.includes("80**3****"))
	{
		sendText(sender,"can you tell me about any landmark that can help our boy to locate your house easily?")
	}
	else if(text.includes("near webel more"))
	{
		sendText(sender,"saltlake,kolkata,near webel more.")
	}
	else if(text.includes("how long will you take to deliver?"))
	{
		sendText(sender,"about 20 minutes sir.")
	}
	else if(text.includes("pay"))
	{
		sendText(sender,"only Rs.130/- sir.")
	}
	else if(text.includes("thanks"))
	{
		sendText(sender,"welcome. bye for now.")
	}else {
		sendText(sender,"How can I help you?")
	}
}

function sendText(sender, text) {
	let messageData = {text: text}
	sendRequest(sender,messageData)
}
function sendButtonMessage(sender,text) {
	let messageData={
		"attachment":{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":text,
				"buttons":[
					{
						"type":"postback",
						"title":"veg pizza",
						"payload":"veg pizza"
					},
					{
						"type":"postback",
						"title":"non veg pizza",
						"payload":"non veg pizza"
					}
				]
			}
		}
	}
	sendRequest(sender,messageData)
}

function sendRequest(sender,messageData){
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port : localhost:"+app.get('port'))
})
