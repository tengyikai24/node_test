/**
 * Created by itdev on 14-7-3.
 */
var fs = require('fs');
var  jdata=fs.readFileSync('e:\\src\\mingw32\\cpp\\test1.json');

console.log(jdata.toString());
var http = require('http');
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    //res.writeHead(200,{'Content-Type':'application/octet-stream'});
    res.write(jdata);
    res.end();
}).listen(8001);
console.log('http server is running'+new Date());
