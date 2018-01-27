'use strict';
/*****************************************************************************************

  EXPRESS http://expressjs.com/en/api.html

  BODY-PARSER https://www.npmjs.com/package/body-parser

  COOKIE-PARSER https://www.npmjs.com/package/cookie-parser

*****************************************************************************************/

const express = require("express");
const cookieSession = require('cookie-session');
//const cookieParser = require('cookie-parser');
//app.use(cookieParser());
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const database = require('./database');

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession( {
  name: 'session',
  keys: [process.env.SECRET_KEY || 'dvelopment']
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`TinyApp is up and running on localhost:${PORT}!`);
});

app.listen(3000);

var user = database.users[""];

const urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};

/*****************************************************************************************

 APP.GET('/DOMAIN-ROUTE', function(request, respond){

 });

 request object - http://expressjs.com/en/api.html#req
 respond object - http://expressjs.com/en/api.html#res

*****************************************************************************************/

//LOCALHOST:8080/index
app.get('/', (req, res) => {

  //const userId = req.session.userId;
  const userId = req.session.userId;
  let user; 
  if (userId) {
    user = database.users[userId];
  }

  const temp = {
    urls: urlDatabase
  };

  console.log("ENTERING - app.get('/', (req, res) => { \n\n"
    //+ "\nuserId: " + user.userId
    + "\nreq.session.userId: " + req.session.userId
    //+ "\ndatabase.users[userId]: " + database.users[userId]
    + "\nuser: " + JSON.stringify(user)
    + "\ntemp: " + temp
    + "\ntemp.urls: " + temp.urls
    + "\ntemp['urls']: " + temp['urls']
    + "\ntemp.urlDatabase: " + temp.urlDatabase
    + "\ntemp['urlDatabase']: " + temp['urlDatabase']);

  res.render('index', { user, temp, urlDatabase });
});

//LOCALHOST:8080/URLS.JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//LOCALHOST:8080/INDEX/NEW
app.get("/index/new", (req, res) => {
  res.render("index_new");
});

//LOCALHOST:8080/U/${SHORTURL} : === "req.params"
app.get("/u/:shortURL/", (req, res) => {
	let longURL = urlDatabase[req.params['shortURL']];
	res.redirect(longURL);
});

//LOCALHOST:8080/${ID}
app.get("/index/:id", (req, res) => {
  const templateVars = { 
  	shortURL: req.params.id 
  };

  res.render("index_show", templateVars);
});

app.get("/index/:id/delete", (req, res) => {
  res.redirect("/index");
});

/*****************************************************************************************

 APP.POST('/DOMAIN-ROUTE', function(request, respond){

 });

 request object - http://expressjs.com/en/api.html#req
 respond object - http://expressjs.com/en/api.html#res

*****************************************************************************************/
app.post('/logout', (req, res) => {
  	// const temp = {
  	// 	urls: urlDatabase
  	// };
	req.session.userId = "";
  res.redirect('/');

	//res.render('index', { user, temp, urlDatabase });
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  for (let userId in database.users) {
    const dbUser = database.users[userId];

    if (dbUser.email === email) {
      user = dbUser;

      break;
    }
  }

  if (user) {

  	   //  console.log(
      //   "EMAIL: " + email + 
      //   "\n\n PASSWORD: " + password + 
      //   "\n\n COMPARED WITH: " + user.password +
      //   "\n\n USER: " + JSON.stringify(user) + 
      //   "\n\n DATABASE.USERS: " + JSON.stringify(database.users) +
     	// "\n\n BCRYPT: " + (bcrypt.compareSync(password, user.password)));

  	    //FIXME BCRYPT
    //if (bcrypt.compareSync(password, user.password)) {
    if (password === user.password) {
      req.session.userId = user.userId;
	console.log("/login " + JSON.stringify(user));
      res.redirect('/');
    } else {
      res.status(401).send("<h1>💩</h1>");
    }
  } else {
    res.status(401).send("<h1>💩</h1>");
  }
});


app.post("/", (req, res) => {
	const temp = {
  		urls: urlDatabase
  	};

	urlDatabase[generateRandomString()] = req.body['longURL'];
  	res.redirect("/");
});

app.post("/index/:id", (req, res) => {
	urlDatabase[req.params.id] = req.body['shortURL'];
	res.redirect("/index");
});

app.post("/index/:id/delete", (req, res) => {
	delete urlDatabase[req.params.id];
  	res.redirect("/index");
});


/*****************************************************************************************

  FUNCTIONS BELOW

*****************************************************************************************/

function generateRandomString() {

	//Determines length of alphaneumerical string
	const length = 6;

	//Determines allowed elements for the string
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    //console.log(`There are ${Math.pow(chars.length, length)} possible url`)

    var result = '';
    for (var i = length; i > 0; --i) {
    	result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}