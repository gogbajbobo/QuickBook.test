require('dotenv').config()

const express = require('express')
const app = express()

const OAuthClient = require('intuit-oauth')

app.get('/', (req, res) => res.json({ result: 'ok' }))

app.get('/callback', (req, res) => {
    res.json({ callback: true })
})

app.get('/authUri', (req,res) => {

    const oauthClient = new OAuthClient({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        environment: process.env.EVIRONMENT,
        redirectUri: process.env.REDIRECT_URI,
    })

    const authUri = oauthClient.authorizeUri({
        scope: [
            OAuthClient.scopes.Accounting,
            OAuthClient.scopes.OpenId,
        ],
        state: 'testState',
    })

    console.log(authUri)
    res.redirect(authUri)

})

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`💻 Server listening on port ${ server.address().port }`)
})
