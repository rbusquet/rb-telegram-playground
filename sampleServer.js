var http = require('http');

var TelegramBot = require('./telegrambot');

var BobBot = new TelegramBot(process.env.TELEGRAM_TOKEN);

BobBot.run();

BobBot.on('update', function(update) {
	console.log(update);
});
var port = process.env.PORT || 5000;

var srv = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
 	res.end('This is sample bot page. You are welcome!');
});

srv.listen(port);