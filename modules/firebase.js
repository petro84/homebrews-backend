const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccount.json');

admin.initializeApp({ 
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://homebrews-database-default-rtdb.firebaseio.com'
});

const db = admin.database();

module.exports = db;