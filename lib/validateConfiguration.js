const { 
  assertIssuer, 
  assertClientId
} = require('@okta/configuration-validation');

const validation = {};

module.exports = validation;

validation.errors = [];

validation.issuer = (issuer) => {
  return this._validate(assertIssuer, issuer);
};

validation.clientId = (clientId) => {
  return this._validate(assertClientId, clientId, true);
}

validation._validate = (fn, value, optional=false) => {
  try {
    fn(value);
  } catch (e) {
    if (!optional) { 
      this.errors.push(e.message);
    }
  }
  return this.errors;
}