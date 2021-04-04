#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('dotenv').config()
const app = require("./app")
const http = require("http")

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Configure server port
 */
server.listen(process.env.API_PORT)

module.exports = server