//var express = require('express');
var fs = require('fs');
var request = require('request');

var actions = require('./actions.js');

var TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY || fs.readFileSync('telegram_api_key').toString();

var TELEGRAM_URL = 'https://api.telegram.org/bot' + TELEGRAM_API_KEY + '/';

var MESSAGES_INTERVAL = process.env.MESSAGES_INTERVAL || 10000;

var offset = 0;
var apiCall = function(slug) {
	return TELEGRAM_URL + slug;
}

var clients = [];
var messages = [];


// TODO: CHECK ERRO STATE
var sendMessage = function(chat_id, message) {
	var form = {
		chat_id: chat_id,
		text: message,
	}
	request.post(apiCall("sendMessage"),
		{form: form},
		function(error, response, body) {
			console.log(body);
		});
}

var polling = function(offset) {
	var form = {timeout: 100, offset: 0};
	if (offset) {
		console.log("received offset " + offset);
		form.offset = offset;
	}
	request.post(apiCall("getUpdates"),
		{form: form},
		function(error, response, body) {
			console.log(body);
			var postResult = JSON.parse(body);
			if (postResult.ok) {
				var updates = postResult.result;
				for (var i = 0; i < updates.length; i++) {
					var update = updates[i];
					offset = update.update_id + 1;

					if (update.message) {
						var message = update.message;
						console.log(message.text);
						if (message.text.lastIndexOf("\/",0) >= 0) {
							var action = actions[message.text.slice(1)];
							if (action)
								action(message.from);
							else
								sendMessage(message.chat.id, "Não entendi!");
						}
					}
				};
			}
			polling(offset);
		});
}

var sendMessagesToUsers = function() {
	var users = actions.usuarios();

	for (var i = 0; i < users.length; i++) {
		var user = users[i];
		var message = "Olá! " + user.username;
		sendMessage(user.id, message);
	};
}
var main = function() {
	// get updates
	polling();
	// sends messages to users
	setInterval(sendMessagesToUsers, MESSAGES_INTERVAL);
}
request.post(apiCall("getMe"), function(error, response, body) {
	console.log(body);
	main();
});

