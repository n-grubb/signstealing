const { MongoClient } = require("mongodb")

// setup MongoDB connection
const mongoURL = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoURL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})

module.exports = async () => {
	try {
		await client.connect()
		const db = client.db('bbdb')
		const projections = db.collection('projections')
		const allPlayers =projections.find().sort({ ADP: 1 }).limit(100) 
		return allPlayers.toArray()
	}
	finally {
		// await client.close();
	}
}
