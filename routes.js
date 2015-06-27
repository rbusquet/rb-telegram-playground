var express = require('express');

var router = express.Router();

router.use(function(req, res, next) {
	console.log('Time: ', new Date());
	next();
});

router.get('/', function(req, res) {
	var options = {
    	root: __dirname,
    	dotfiles: 'deny',
    	headers: {
        	'x-timestamp': Date.now(),
        	'x-sent': true
    	}
  	};
	res.sendFile('/info.html', options);
});

module.exports = router