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
app.get("/new", (req, res) => {

  const userId = req.session.userId;
  let user;
  if (userId) {
    user = database.users[userId];
  }

  const temp = {
    urls: urlDatabase
  };


  res.render("index_new", { user, temp, urlDatabase });
});

//LOCALHOST:8080/U/${SHORTURL} : === "req.params"
app.get("/u/:shortURL/", (req, res) => {
  const userId = req.session.userId;
  let user;
  if (userId) {
    user = database.users[userId];
  }

  const temp = {
    urls: urlDatabase
  };

  let longURL = urlDatabase[req.params['shortURL']];
  res.redirect(longURL);
});

//LOCALHOST:8080/${ID}
app.get("/url/:id", (req, res) => {
  const userId = req.session.userId;
  let user;
  if (userId) {
    user = database.users[userId];
  }

  const temp = {
    urls: urlDatabase
  };

  let shortURL = req.params.id;
  let longURL = temp.shortURL;


  res.render("index_show", { user, shortURL, longURL});
});

app.get("/:id/delete", (req, res) => {
  res.redirect("/");
});

app.get('/signup', (req, res) => {
  const userId = req.session.userId;
  let user;
  if (userId) {
    user = database.users[userId];
  }

  const temp = {
    urls: urlDatabase
  };


  res.render('index_signup', {user});
});

/*****************************************************************************************

 APP.POST('/DOMAIN-ROUTE', function(request, respond){

 });

 request object - http://expressjs.com/en/api.html#req
 respond object - http://expressjs.com/en/api.html#res

*****************************************************************************************/
app.post('/logout', (req, res) => {
	req.session.userId = "";
  res.redirect('/');
});

app.post('/signup', (req, res) => {
  let randoId = generateRandomString();
  database.users[randoId] = {
    userId: randoId,
    email: req.body['email'],
    password: bcrypt.hashSync(req.body['password'], 10),
  };

  console.log(database.users);

  res.redirect('/')
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

        console.log(user.password)
    if (bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.userId;
	    console.log("/login " + JSON.stringify(user));
      res.redirect('/');

    } else {
      res.status(401).send("<h1>4💩1</h1>");

    }
  } else {
    res.status(401).send("<h1>4💩1</h1>");

  }
});


app.post("/", (req, res) => {
	const temp = {
  		urls: urlDatabase
  	};

	urlDatabase[generateRandomString()] = req.body['longURL'];
  	res.redirect("/");
});

app.post("/url/:id", (req, res) => {
	urlDatabase[req.params.id] = req.body['shortURL'];
	res.redirect("/");
});

app.post("/url/:id/delete", (req, res) => {
	delete urlDatabase[req.params.id];
  	res.redirect("/");
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

function userHandler() {
  const userId = req.session.userId;
  let user;
  if (userId) {
    user = database.users[userId];
  }

  const temp = {
    urls: urlDatabase
  };
}