'use strict'

const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

app.set('view engine', 'ejs')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET_KEY || 'dvelopment']
}))

const bcrypt = require('bcrypt')

app.listen(PORT, () => {
  console.log(`TinyApp is up and running on localhost:${PORT}!`)
})

const userDatabase = {
  'userId': {
    id: 'userId',
    email: 'example@email.com',
    password: bcrypt.hashSync('password', 10)
  }
}

const urlDatabase = {
  'example': {
    longURL: 'http://www.lighthouselabs.ca',
    creator: 'userId'
  }
}

const checkEmailExists = (email) => {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true
    }
    return false
  }
}

const checkUserExists = (user) => {
  for (let userId in userDatabase) {
    if (userId === user) {
      return userId
    }
  } return false
}

const renderUrlListAt = (req, res, renderDest) => {
  if (checkUserExists(req.session.user_id) === req.session.user_id) {
    let userSpecificURLS = {}
    for (let url in urlDatabase) {
      if (urlDatabase[url].creator === req.session.user_id) {
        userSpecificURLS[url] = urlDatabase[url]
      }
    }

    let templateVars = {
      urls: userSpecificURLS,
      username: userDatabase[req.session.user_id]
    }

    res.render(renderDest, templateVars)
  } else {
    res.status(401).send(`Error: 401: <a href="/"> Back </a>`)
  }
}

function appGet () {
  app.get('/urls.json', (req, res) => {
    res.json(urlDatabase)
  })

  app.get(`/login`, (req, res) => {
    res.redirect(`/`)
  })

  app.get('/', (req, res) => {
    let templateVars = {
      url: urlDatabase,
      username: userDatabase[req.session.user_id]}

    if (checkUserExists(req.session.user_id) === req.session.user_id) {
      res.render('index', templateVars) // Check out the urls!!
    } else {
      res.render('index', templateVars) // Make an account or something!!
    }
  })

  app.get('/urls', (req, res) => {
    renderUrlListAt(req, res, 'index')
  })

  app.get('/urls/new', (req, res) => {
    renderUrlListAt(req, res, 'index_new')
  })

  app.get('/u/:shortURL/', (req, res) => {
    if (!urlDatabase[req.params.shortURL]) {
      res.status(404).send(`Error: 401: <a href="/"> Back </a>`)
    }
    res.redirect(urlDatabase[req.params.shortURL].longURL)
  })

  app.get('/url/:id', (req, res) => {
    if (!(urlDatabase[req.params.id])) {
      res.status(404).send(`Error: 401: <a href="/"> Back </a>`)
      return
    } if (!req.session.user_id) {
      res.status(401).send(`Error: 401: <a href="/"> Back </a>`)
      return
    } if (urlDatabase[req.params.id].creator !== req.session.user_id) {
      res.status(403).send(`Error: 403: <a href="/"> Back </a>`)
      return
    } if (checkUserExists(req.session.user_id)) {
      let templateVars = {
        url: req.params.id,
        long: urlDatabase[req.params.id].longURL
      }

      res.render('index_show', templateVars)
    }
  })

  app.get('/signup', (req, res) => {
    if (checkUserExists(req.session.user_id) === req.session.user_id) {
      res.redirect('/')
    }

    let templateVars = {
      url: undefined,
      username: undefined
    }

    res.render('signup', templateVars)
  })
}
appGet()

function appPost () {
  app.post('/urls/:id/delete', (req, res) => {
    delete urlDatabase[req.params.id]
    res.redirect('/urls')
  })

  app.post('/urls', (req, res) => {
    if (checkUserExists(req.session.user_id)) {
      let newShortURL = generateRandomString()
      urlDatabase[newShortURL] = {
        longURL: req.body.longURL,
        creator: req.session.user_id
      }

      res.redirect('/urls')
    } else {
      res.status(401).send(`Error: 401: <a href="/"> Back </a>`)
    }
  })

  app.post('/urls/:id', (req, res) => {
    if (!(urlDatabase[req.params.id])) {
      res.status(404).send(`Error: 401: <a href="/"> Back </a>`)
      return
    } if (!req.session.user_id) {
      res.status(401).send(`Error: 401: <a href="/"> Login Now! </a>`)
      return
    } if (urlDatabase[req.params.id].creator !== req.session.user_id) {
      res.status(403).send(`Error: 403: <a href="/"> Back </a>`)
      return
    } if (checkUserExists(req.session.user_id)) {
      urlDatabase[req.params.id] = {
        longURL: req.body.newURL,
        creator: req.session.user_id
      }

      res.redirect('/urls')
    }
  })

  app.post('/login', (req, res) => {
    for (let user in userDatabase) {
      if ((userDatabase[user].email === req.body.email) && bcrypt.compareSync(req.body.password, userDatabase[user].password)) {
        req.session.user_id = userDatabase[user].id
        res.redirect('/urls')
        return
      }
    }
    res.status(401).send(`Error: 401: <a href="/"> Back </a>`)
  })

  app.post('/logout', (req, res) => {
    req.session.user_id = null
    res.redirect('/')
  })

  app.post('/signup', (req, res) => {
    if (req.body.email === '' || req.body.password === '') {
      res.status(400).send('No email or password <a href="/signup">Back</a>')
    } else if (checkEmailExists(req.body.email)) {
      res.status(400).send('This account already exists <a href="/signup">Back</a>')
    } else {
      let newUserId = generateRandomString()

      userDatabase[newUserId] = {
        id: newUserId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      }

      req.session.user_id = newUserId
      res.redirect('/urls')
    }
  })
}
appPost()

function generateRandomString () {
  const lengthOfStringGenerated = 6
  const charsAllowedInString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let randomlyGeneratedString = ''
  for (let i = lengthOfStringGenerated; i > 0; --i) {
   	randomlyGeneratedString += charsAllowedInString[Math.floor(Math.random() * charsAllowedInString.length)]
  }

  return randomlyGeneratedString
}
