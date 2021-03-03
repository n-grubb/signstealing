'use strict';
const express = require('express')
const serverless = require('serverless-http')
// import bodyParser from 'body-parser'
const getPlayers = require('./getPlayers')

// Initialize express app
const app = express()
const router = express.Router()
const basePath = process.env.NODE_ENV === 'dev' ? '/api' : '/.netlify/functions/api/' // Set the base path for local dev

/* define routes */
router.get('/players', async (req, res) => {
	const players = await getPlayers()
	res.json({
	  players
	})
})

// Setup routes
app.use(basePath, router)

// Apply express middlewares
// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({ extended: true }))

// Export lambda handler
exports.handler = serverless(app)
