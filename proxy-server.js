/*jshint esversion: 6 */
var express = require('express');
var request = require('request');
var fs = require('fs');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(req.url);
  next();
});


app.get('/main/*', (req, res) => {
	let url = req.url;
	url = url.substr(5);
	let domain, lastRequested;
	let parsed = processURL(url, true);
	url = parsed[0];
	domain = parsed[1];
	lastRequested = parsed[2];

	request(url, function (error, response, body) {
  	console.log('error:', error); // Print the error if one occurred
  	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		// console.log('body:', body); // Print the HTML for the Google homepage.
		if(response) res.setHeader('statusCode', response.statusCode);
		res.send({ content: body, domain, lastRequested });
	});
});

app.get('*', (req, res) => {

	let url, domain, lastRequested;
	
	let parsed = processURL(req.url);
	url = parsed[0];
	domain = parsed[1];
	lastRequested = parsed[2];
	
	try {
		request
		.get(url)
		.on('response', function (response) {
			console.log(response) // 200
			// console.log(response.headers['content-type']);
			//TODO: add headers for the response 
			 // 'image/png'
		}).pipe(res);
	} catch (e) {
		console.log("===== ", e);
	}
		
})



	app.listen(5000, (err) => {
		if (err) {
			console.log(`ERROR: ${err}`);
		} else {
			console.log("Listening on Port: 5000");
		}
	});

function processURL(URL, explicit = false){
	let url = URL.replace('/', '');

	// adding protocol if not present 
	// if not present then default https:// will be added
	if (!(url.startsWith('http://') || url.startsWith('https://'))) {
		url = 'https://' + url;
	}

	if (explicit) {
		// adding www. if it url does not contains it already
		if (url.indexOf('/www.') == -1) {
			if (url.startsWith('https://')) {
				url = url.replace('https://', 'https://www.');
			} else {
				url = url.replace('http://', 'http://www.');
			}
		}
	}

	// removing last '/' for proper further processing 
	if (url.endsWith('/')) {
		url = url.substr(0, url.length - 1);
	}

	let domain, lastRequested;
	domain = url.split('/')[2];
	lastRequested = url;

	return [url, domain, lastRequested];
	}