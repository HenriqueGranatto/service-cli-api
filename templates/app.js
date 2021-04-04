/**
 * Module dependencies.
 */
require('dotenv').config()
const fs = require("fs")
const path = require("path")
const express = require("express")

/**
 * Create app.
 */
const app = express()

/**
 * Configure app port.
 */
app.set("port", process.env.API_PORT)

/**
 * Configure app request.
 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * Include all routes in path /routes
 */
fs.readdir(path.join(__dirname, "routes"), (err, routes) => {
    routes.map(file => {
        app.use("/", require(path.join(__dirname, "routes", file)))
    });
})

module.exports = app