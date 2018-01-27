// 'use strict';

const urlDatabase = {
    'b2xVn2': "http://www.lighthouselabs.ca",
    '9sm5xK': "http://www.google.com"
}

/* DEFINE THIS IN THE SCOPE OF APP.GET TO ACCESS

	const temp= {
  		urls: urlDatabase
  	};
  	
 */

/* //MY PLAYGROUND OF UNDERSTANDING OBJECTS D:
 * for(let shortURL in temp.urls){
 * 	//OBJECT OF MANY URLS
 * 	console.log(temp.urls);
 *
 *	//GET KEYS(SHORTURLS) OF THIS OBJECT
 * 	console.log(shortURL);
 *
 * 	//GET LINKS OF THIS OBJECT FROM PREVIOUSLY FOUND KEYS
 * 	console.log(urlDatabase[shortURL]);
 *
 * }
 */

exports.urlDatabase = urlDatabase;