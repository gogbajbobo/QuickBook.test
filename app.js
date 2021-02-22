require('dotenv').config()

const express = require('express')
const app = express()

const OAuthClient = require('intuit-oauth')

const oauthClient = new OAuthClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    environment: process.env.EVIRONMENT,
    redirectUri: process.env.REDIRECT_URI,
})

app.get('/', (req, res) => res.json({ result: 'ok' }))

app.get('/callback', (req, res) => {

    const { query } = req

    const parseRedirect = req.url

    console.log(`token 1 ${ JSON.stringify(oauthClient.getToken(), null, '\t') }`)

    oauthClient.createToken(parseRedirect)
        .then(authResponse => {

            console.log('The Token is ' + JSON.stringify(authResponse.getJson()))
            console.log(`token 2 ${ JSON.stringify(oauthClient.getToken(), null, '\t') }`)

        })
        .catch(e => {
            console.error("The error message is : " + e.originalMessage)
            console.error(e.intuit_tid)
        })

    res.json(query)

})

app.get('/refresh', (req, res) => {

    console.log(`token 3 ${ JSON.stringify(oauthClient.getToken(), null, '\t') }`)

    oauthClient.refresh()
        .then(authResponse => {

            console.log('Tokens refreshed : ' + JSON.stringify(authResponse.json, null, '\t'))
            res.send('Tokens refreshed : ' + JSON.stringify(authResponse.json, null, '\t'))

        })
        .catch(e => {

            console.error(e)
            console.error("The error message is : " + e.originalMessage)
            console.error(e.intuit_tid)
            res.send("The error message is : " + e.originalMessage)

        })

})

app.get('/info', (req, res) => {

    const companyID = oauthClient.getToken().realmId

    const url = oauthClient.environment === 'sandbox'
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production

    oauthClient
        .makeApiCall({ url: `${ url }v3/company/${ companyID }/companyinfo/${ companyID }` })
        .then(response => {

            console.log(`The response for API call is :${JSON.stringify(response)}`)
            res.send(JSON.parse(response.text()))

        })
        .catch(e => {

            console.error(e)
            res.send(e.message)

        })

})

app.get('/authUri', (req,res) => {

    const authUri = oauthClient.authorizeUri({
        scope: [
            OAuthClient.scopes.Accounting,
            OAuthClient.scopes.OpenId,
        ],
        state: 'testState',
    })

    res.redirect(authUri)

})

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`💻 Server listening on port ${ server.address().port }`)
})
