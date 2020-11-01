const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://nizthedev:nizthedev@node.hixau.mongodb.net/node?retryWrites=true&w=majority')
    .then(client => {
      console.log('SUCCESS')
      callback(client)
    })
    .catch(err => console.log(err))
}

module.exports = mongoConnect