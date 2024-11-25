
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://NguyenDucNghia:cmDmebL5168KMJPx@cluster0.gf1bc.mongodb.net/';

async function connectToMongoDB() {
    const client = new MongoClient(uri); 

    try {
        await client.connect();
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    } finally {
        await client.close();
    }
}

connectToMongoDB();
