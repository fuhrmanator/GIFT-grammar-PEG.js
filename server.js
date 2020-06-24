var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8181, function(){
    console.log('Server running on 8181...');
});
