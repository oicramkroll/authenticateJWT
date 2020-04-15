const Knex = require("knex")
const configuration = require('../../knexfile');
const connecion = Knex(configuration.development);
module.exports = connecion;
