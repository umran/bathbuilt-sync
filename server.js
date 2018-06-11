var async = require('async')
var mongoose = require('mongoose')
var sync = require('./modules/sync_v2')
var config = require('./config')

var server = require('contentful-webhook-server')({
  path: '/',
  username: config.contentful_sync.username,
  password: config.contentful_sync.password
})

mongoose.connect(config.mongo_url)
mongoose.connection.on('connected', function(){
  console.log("Connection to mongodb established")
})
mongoose.connection.on('error', function(err){
  console.log(err)
})
mongoose.connection.on('disconnected', function(){
  console.log("Connection to mongodb disconnected")
})

var queue = async.queue(function(task, callback) {
    console.log('initiating sync of type: ' + task.type)
    sync.init(function(err, res) {
      if (err) {
        callback(err)
        return
      }

      sync.process(res)
      setTimeout(function(){
        callback()
      }, 300000)
    })
}, 1)

server.on('ContentManagement.Entry.publish', function(req){
  console.log('sync of type publish queued')
  q.push({type: 'publish'}, function(err) {
      console.log('finished processing sync of type publish')
  })
})

server.on('ContentManagement.Entry.unpublish', function(req){
  console.log('sync of type unpublish queued')
  q.push({type: 'unpublish'}, function(err) {
      console.log('finished processing sync of type unpublish')
  })
})

server.listen(3001, function(){
  console.log('Contentful webhook server running on port ' + 3001)
})
