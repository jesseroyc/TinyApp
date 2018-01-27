const express = require("express");
const app = express();

//NO BCRYPT DAMNIT
// const bcrypt = require('bcrypt');

//NO COOKIES DAMNIT
// const cookieSession = require('cookie-session');
// app.use(cookieSession({
//   name: 'session',
//   keys: [process.env.SECRET_KEY || 'dvelopment']
// }));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Up and running on localhost:${PORT}!`);
});


var urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};

/*****************************************************************
*****************************************************************/


app.get('/', (req, res) => {
	const templateVars = { 
		urls: urlDatabase,
	};

	console.log(urls);
  res.render('test');
});

app.post('/', (req, res) => {
	const templateVars = { 
		urls: urlDatabase,
	};

	console.log(urls);
});