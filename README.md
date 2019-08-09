# movement-middleware-okta-jwt
Node.js Express Middleware to verify OKTA jwt tokens

## Modules

<dl>
<dt><a href="#module_{jwtVerifier}">{jwtVerifier}</a> ⇒ <code>JwtVerifier~verifyAccessToken</code></dt>
<dd><p>A wrapper function for the JwtVerifier class. In most cases this will be used
as the middleware function, but if you need more flexibility see
the JwtVerifier class docs, and you can import just the class.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#JwtVerifier">JwtVerifier</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#JwtVerifier">JwtVerifier</a></dt>
<dd></dd>
</dl>

<a name="module_{jwtVerifier}">jwtVerifier</a>

## {jwtVerifier} ⇒ <code>JwtVerifier.verifyAccessToken</code>
A wrapper function for the JwtVerifier class. In most cases this will be used
as the middleware function, but if you need more flexibility see
the JwtVerifier class docs, and you can import just the class.

**Returns**: <code>JwtVerifier.verifyAccessToken</code> - The verifyAccessToken middleware method.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options needed to verify your JWT token in the express middleware. *Note:* only the `issuer` property is required. |
| options.issuer | <code>string</code> | The issuer url that the JWT token was generated from, something like `https://{yourOktaDomain}/oauth2/default`. |
| options.clientId | <code>string</code> | The client ID from your OKTA instance. See https://developer.okta.com/docs/guides/find-your-app-credentials/overview/ |
| options.assertClaims | <code>Object</code> | The claims assertions you have attached to the JWT token. |
| options.cacheMaxAge | <code>number</code> | The max cache age for the JWT tokens you want to verify. |
| options.jwksRequestsPerMinute | <code>number</code> | The amount of JWKS requests that are made per minute for the JWT token. |

**Example**  
```js
const express = require('express');
const jwtVerifier = require('express-okta-jwt-verifier');

const app = express();


app.get('/', (req, res, next) => {
 res.send('This is a public route');
});

app.get('/api', jwtVerifier({ issuer: 'https://example.okta.com/oauth2/default' }), (req, res, next) => {
 res.send('This is a protected route.')
});


module.exports = app;
```
<a name="JwtVerifier"></a>

## JwtVerifier

* [JwtVerifier](#JwtVerifier)
    * [new JwtVerifier(options)](#new_JwtVerifier_new)
    * [.createJwtVerifier()](#JwtVerifier+createJwtVerifier) ⇒ <code>OktaJwtVerifier</code>
    * [.verifyAccessToken(req, res, next)](#JwtVerifier+verifyAccessToken) ⇒ <code>express~Next</code> \| <code>void</code>

<a name="new_JwtVerifier_new"></a>

### new JwtVerifier(options)
Creates a new instance of the JwtVerifier for OKTA used in the express middleware. The only option required is your
issuer url, which will look something like `https://{yourOktaDomain}/oauth2/default`. 
If you do not have an okta domain feel free to sign up https://www.okta.com/free-trial/.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options needed to verify your JWT token in the express middleware. *Note:* only the `issuer` property is required. |
| options.issuer | <code>string</code> | The issuer url that the JWT token was generated from, something like `https://{yourOktaDomain}/oauth2/default`. |
| options.clientId | <code>string</code> | The client ID from your OKTA instance. See https://developer.okta.com/docs/guides/find-your-app-credentials/overview/ |
| options.assertClaims | <code>Object</code> | The claims assertions you have attached to the JWT token. |
| options.cacheMaxAge | <code>number</code> | The max cache age for the JWT tokens you want to verify. |
| options.jwksRequestsPerMinute | <code>number</code> | The amount of JWKS requests that are made per minute for the JWT token. |

**Example**  
```js
// Use the JwtVerifier as a construct, and not a function.
const express = require('express');
const { JwtVerifier } = require('express-okta-jwt-verifier');
const app = express();

var verifier = new JwtVerifier({ issuer: 'https://example.okta.com/oauth2/default' });

app.get('/', (req, res, next) => {
 res.send('This is a public route');
});

app.get('/api', verifier.verifyAccessToken, (req, res, next) => {
 res.send('This is a protected route.')
});


module.exports = app;
```
<a name="JwtVerifier+createJwtVerifier"></a>

### jwtVerifier.createJwtVerifier() ⇒ <code>OktaJwtVerifier</code>
Creates a new OktaJwtVerifier instance. This will utilize the options that are 
in the constructor.
 
**Returns**: <code>OktaJwtVerifier</code> - The OktaJwtVerifier used for verifying access tokens. See https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier for further details.  
<a name="JwtVerifier+verifyAccessToken"></a>

### jwtVerifier.verifyAccessToken(req, res, next) ⇒ <code>express~Next</code> \| <code>void</code>
Verifies the request authorization header is a JWT token and is actually a valid OKTA JWT token. If there is no 
OktaJwtVerifier instance created, it will return a HTTP status of 400.

**Kind**: instance method of [<code>JwtVerifier</code>](#JwtVerifier)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>express~Request</code> | The request object, see https://expressjs.com/en/api.html#req for further details |
| res | <code>express~Repsonse</code> | The response object, see https://expressjs.com/en/api.html#res |
| next | <code>express~Next</code> | The next callback function. |

<a name="JwtVerifier"></a>

## JwtVerifier

* [JwtVerifier](#JwtVerifier)
    * [new JwtVerifier(options)](#new_JwtVerifier_new)
    * [.createJwtVerifier()](#JwtVerifier+createJwtVerifier) ⇒ <code>OktaJwtVerifier</code>
    * [.verifyAccessToken(req, res, next)](#JwtVerifier+verifyAccessToken) ⇒ <code>express~Next</code> \| <code>void</code>

<a name="new_JwtVerifier_new"></a>

### new JwtVerifier(options)
Creates a new instance of the JwtVerifier for OKTA used in the express middleware. The only option required is your
issuer url, which will look something like `https://{yourOktaDomain}/oauth2/default`. 
If you do not have an okta domain feel free to sign up https://www.okta.com/free-trial/.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options needed to verify your JWT token in the express middleware. *Note:* only the `issuer` property is required. |
| options.issuer | <code>string</code> | The issuer url that the JWT token was generated from, something like `https://{yourOktaDomain}/oauth2/default`. |
| options.clientId | <code>string</code> | The client ID from your OKTA instance. See https://developer.okta.com/docs/guides/find-your-app-credentials/overview/ |
| options.assertClaims | <code>Object</code> | The claims assertions you have attached to the JWT token. |
| options.cacheMaxAge | <code>number</code> | The max cache age for the JWT tokens you want to verify. |
| options.jwksRequestsPerMinute | <code>number</code> | The amount of JWKS requests that are made per minute for the JWT token. |

**Example**  
```js
// Use the JwtVerifier as a construct, and not a function.
const express = require('express');
const { JwtVerifier } = require('express-okta-jwt-verifier');
const app = express();

var verifier = new JwtVerifier({ issuer: 'https://example.okta.com/oauth2/default' });

app.get('/', (req, res, next) => {
 res.send('This is a public route');
});

app.get('/api', verifier.verifyAccessToken, (req, res, next) => {
 res.send('This is a protected route.')
});


module.exports = app;
```
<a name="JwtVerifier+createJwtVerifier"></a>

### jwtVerifier.createJwtVerifier() ⇒ <code>OktaJwtVerifier</code>
Creates a new OktaJwtVerifier instance. This will utilize the options that are 
in the constructor.

**Returns**: <code>OktaJwtVerifier</code> - The OktaJwtVerifier used for verifying access tokens. See https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier for further details.  
<a name="JwtVerifier+verifyAccessToken"></a>

### jwtVerifier.verifyAccessToken(req, res, next) ⇒ <code>express~Next</code> \| <code>void</code>
Verifies the request authorization header is a JWT token and is actually a valid OKTA JWT token. If there is no 
OktaJwtVerifier instance created, it will return a HTTP status of 400.


| Param | Type | Description |
| --- | --- | --- |
| req | <code>express~Request</code> | The request object, see https://expressjs.com/en/api.html#req for further details |
| res | <code>express~Repsonse</code> | The response object, see https://expressjs.com/en/api.html#res |
| next | <code>express~Next</code> | The next callback function. |

