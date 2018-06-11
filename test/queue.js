var async = require('async')

var queue = async.queue(function(task, callback) {
    console.log('hello ' + task.name)
    setTimeout(function() {
      callback()
    }, 5000)
}, 1)

queue.push({name: 'publish'}, function(err) {
    console.log('finished processing publish');
})

queue.push({name: 'unpublish'}, function(err) {
    console.log('finished processing unpublish');
})
