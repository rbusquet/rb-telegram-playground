var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var offset = 0;


var TelegramBot = function(api_key) {
	this.api_key = api_key,
	this.TELEGRAM_URL = 'https://api.telegram.org/bot' + api_key + '/';
	this.offset = 0;
	this.discardMsgs = false;
}
util.inherits(TelegramBot, EventEmitter)


TelegramBot.prototype.poll = function(stop) {
	var form = {
		offset: this.offset,
		timeout: 60,
	};
	var self = this;
	// console.log(form);
	request.get(this.TELEGRAM_URL + 'getUpdates',
		{form: form}, function(err, res, body) {
			if (!err) {
				var body = JSON.parse(body);
				if (body.ok) {
					for (i in body.result) {
						result = body.result[i];
						console.log(result);
						if (result.update_id >= self.offset) {
							self.offset = result.update_id + 1;
							self.emit('update', result);
						}
					}
				}
			}
			if (!stop)
				self.poll();
		});
};

TelegramBot.prototype.run = function() {
	this.poll();
};

TelegramBot.prototype.stop = function() {
	this.poll(true);
}

TelegramBot.prototype.post = function(telegramAPIMethod, obj, fn) {
	var self = this;
	request.post(this.TELEGRAM_URL + telegramAPIMethod,
		{form: obj}, function(err, res, body) {
			var json = JSON.parse(body);
			setTimeout(function() {
				if (fn)
					fn(json);
			}, 0);
		});
}
module.exports = TelegramBot;