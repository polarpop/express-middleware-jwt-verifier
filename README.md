# express-middleware-okta-jwt
Node.js Express Middleware to verify OKTA jwt tokens

## Installation
You can install express-middleware-okta-jwt by either yarn or NPM.

### npm
`npm install express-middleware-okta-jwt`

### yarn
`yarn add express-middleware-okta-jwt`

## Usage
This middleware is strictly for express. You can utilize as a global middleware in your express instance, or in a route.
```javascript
const express = require('express');
const jwtVerifier = require('express-middleware-okta-jwt');

const app = express();

// Global middleware
app.use(jwtVerifier({ issuer: 'https://example.okta.com/oauth2/default' }));

// route middleware

const router = new express.Router();

router.get('/', (req, res, next) => {
	res.send('I am a public route');
});

router.get('/verified', jwtVerifier({ issuer: 'https://example.okta.com/oauth2/default' }), (req, res, next) => {
	res.send(`I am a verified route. Context: ${req.jwt}`);
})
```

## API
If you need more flexibility see the [API Docs](./docs/api.md)