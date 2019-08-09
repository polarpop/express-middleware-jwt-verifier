const jwtVerifier = require('@okta/jwt-verifier');
const validate = require('./lib/validateConfiguration');

const VALID_CONFIG_FNS = ['issuer', 'clientId'];

class JwtVerifier {
  /**
  * Creates a new instance of the JwtVerifier for OKTA used in the express middleware. The only option required is your
  * issuer url, which will look something like `https://{yourOktaDomain}/oauth2/default`. 
  * If you do not have an okta domain feel free to sign up https://www.okta.com/free-trial/.
  *
  * @param {Object} options The options needed to verify your JWT token in the express middleware. *Note:* only the `issuer` property is required.
  * @param {string} options.issuer The issuer url that the JWT token was generated from, something like `https://{yourOktaDomain}/oauth2/default`.
  * @param {string?} options.clientId The client ID from your OKTA instance. See https://developer.okta.com/docs/guides/find-your-app-credentials/overview/
  * @param {Object?} options.assertClaims The claims assertions you have attached to the JWT token.
  * @param {number?} options.cacheMaxAge The max cache age for the JWT tokens you want to verify.
  * @param {number?} options.jwksRequestsPerMinute The amount of JWKS requests that are made per minute for the JWT token.
  *
  *
  * @example
  * // Use the JwtVerifier as a construct, and not a function.
  * const express = require('express');
  * const { JwtVerifier } = require('express-okta-jwt-verifier');
  * const app = express();
  *
  * var verifier = new JwtVerifier({ issuer: 'https://example.okta.com/oauth2/default' });
  * 
  * app.get('/', (req, res, next) => {
  *  res.send('This is a public route');
  * });
  *
  * app.get('/api', verifier.verifyAccessToken, (req, res, next) => {
  *  res.send('This is a protected route.')
  * });
  *
  *
  * module.exports = app;
  */
  constructor(options={}) {
    this.errors = [];
    this.validate = validate;
    this.issuer = options.issuer;
    this.clientId = options.clientId;
    this.assertClaims = options.assertClaims;
    this.cacheMaxAge = options.cacheMaxAge;
    this.jwksRequestsPerMinute = options.jwksRequestsPerMinute;
    if (!isFunction) {
      this._validateConfig();
      this.okta = this.createJwtVerifier();
    }
  }

  _validateConfig() {
    if (!this.issuer) {
      this.errors.push('You are missing your issuer url. This is a required attribute.');
    }
    for (let i in VALID_CONFIG_FNS) {
      this.validate[VALID_CONFIG_FNS[i]](this[VALID_CONFIG_FNS[i]]);
    }

    
    this.errors = this.errors.concat(this.validate.errors);
  }

  /**
  * Creates a new OktaJwtVerifier instance. This will utilize the options that are 
  * in the constructor.
  *
  * @return {OktaJwtVerifier} The OktaJwtVerifier used for verifying access tokens. See https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier for further details.
  *
  */
  createJwtVerifier() {
    if (this.errors.length <= 0) {
      let jwtConfig = {
        issuer: this.issuer
      };
      if (this.clientId) {
        jwtConfig['clientId'] = this.clientId;

        if (this.assertClaims && typeof this.assertClaims === 'object') {
          jwtConfig['assertClaims'] = this.assertClaims;
        }

        if (typeof this.cacheMaxAge === 'number' && this.cacheMaxAge) {
          jwtConfig['cacheMaxAge'] = this.cacheMaxAge;
        }

        if (typeof this.jwksRequestsPerMinute === 'number' && this.jwksRequestsPerMinute) {
          jwtConfig['jwksRequestsPerMinute'] = this.jwksRequestsPerMinute;
        }
      }
      return new jwtVerifier(jwtConfig);
    }
  }

  /**
  * Verifies the request authorization header is a JWT token and is actually a valid OKTA JWT token. If there is no 
  * OktaJwtVerifier instance created, it will return a HTTP status of 400.
  *
  * @param {express~Request} req The request object, see https://expressjs.com/en/api.html#req for further details
  * @param {express~Repsonse} res The response object, see https://expressjs.com/en/api.html#res
  * @param {express~Next} next The next callback function.
  *
  * @returns {express~Next|void}
  */
  verifyAccessToken(req, res, next) {
    if (req.user) {
      if (req.user.isAuthenticated) {
        return next();
      }
    }
    if (this.okta) {
      let headers = req.headers.authorization;
      let accessToken;
      if (headers && /(B|b)earer\s/.test(headers)) {
        accessToken = headers.replace(/(B|b)earer\s/, '');
      }
      if (accessToken) {
        this.okta.verifyAccessToken(accessToken)
          .then(jwt => {
            req.jwt = { token: jwt, isAuthenticated: true };
            next();
          })
          .catch(err => {
            res.status(400).send(Buffer.from(err.message));
          });
      } else {
        res.status(401).send(Buffer.from('Unauthorized'));
      }
      
    } else {
      res.status(400).send(Buffer.from({errors: this.errors}));
    }
  }
}

/**
* @alias JwtVerifier
*/
exports.JwtVerifier = JwtVerifier;

/**
* A wrapper function for the JwtVerifier class. In most cases this will be used
* as the middleware function, but if you need more flexibility see
* the JwtVerifier class docs, and you can import just the class.
*
* @exports {jwtVeriifer}
*
* @param {Object} options The options needed to verify your JWT token in the express middleware. *Note:* only the `issuer` property is required.
* @param {string} options.issuer The issuer url that the JWT token was generated from, something like `https://{yourOktaDomain}/oauth2/default`.
* @param {string?} options.clientId The client ID from your OKTA instance. See https://developer.okta.com/docs/guides/find-your-app-credentials/overview/
* @param {Object?} options.assertClaims The claims assertions you have attached to the JWT token.
* @param {number?} options.cacheMaxAge The max cache age for the JWT tokens you want to verify.
* @param {number?} options.jwksRequestsPerMinute The amount of JWKS requests that are made per minute for the JWT token.
*
* @return {JwtVerifier~verifyAccessToken} The verifyAccessToken middleware method. 
*
* @example
* const express = require('express');
* const jwtVerifier = require('express-okta-jwt-verifier');
*
* const app = express();
*
* 
* app.get('/', (req, res, next) => {
*  res.send('This is a public route');
* });
*
* app.get('/api', jwtVerifier({ issuer: 'https://example.okta.com/oauth2/default' }), (req, res, next) => {
*  res.send('This is a protected route.')
* });
*
*
* module.exports = app;
*
*/
module.exports = (options={}) => {
  let Verifier = new JwtVerifier(options);
  return Verifier.verifyAccessToken;
};