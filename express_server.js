'use strict';
/*****************************************************************************************

  EXPRESS http://expressjs.com/en/api.html

  BODY-PARSER https://www.npmjs.com/package/body-parser

*****************************************************************************************/

var express = require("express");
var app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`TinyApp is up and running on localhost:${PORT}!`);
});

var urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};


/*****************************************************************************************

 APP.GET('/DOMAIN-ROUTE', function(request, respond){

 });

 request object - http://expressjs.com/en/api.html#req
 respond object - http://expressjs.com/en/api.html#res

*****************************************************************************************/

//LOCALHOST:8080/URLS.JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//LOCALHOST:8080/URLS
app.get("/urls", (req, res) => {
  const templateVars = { 
  	urls: urlDatabase 
  };

  res.render("urls_index", templateVars);
});

//LOCALHOST:8080/URLS/NEW
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//LOCALHOST:8080/U/${SHORTURL} : === "req.params"
app.get("/u/:shortURL/", (req, res) => {

	let longURL = urlDatabase[req.params['shortURL']];

	res.redirect(longURL);
});

//LOCALHOST:8080/${ID}
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
  	shortURL: req.params.id 
  };

  res.render("urls_show", templateVars);
});

/*****************************************************************************************

 APP.POST('/DOMAIN-ROUTE', function(request, respond){

 });

 request object - http://expressjs.com/en/api.html#req
 respond object - http://expressjs.com/en/api.html#res

*****************************************************************************************/

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body['longURL'];
  console.log(urlDatabase);
  res.redirect("/urls");
});

/*****************************************************************************************

  FUNCTIONS BELOW

*****************************************************************************************/

function generateRandomString() {

	//Determines length of alphaneumerical string
	const length = 6;

	//Determines allowed elements for the string
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    //console.log(`There are ${Math.pow(chars.length, length)} possible urls`)

    var result = '';
    for (var i = length; i > 0; --i) {
    	result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}