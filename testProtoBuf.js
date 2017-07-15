/**
 * Created by itdev on 14-7-3.
 */
var KEY_LENGTH = 16;
var crypto = require('crypto');
//console.log(crypto.getCiphers());
var key = new Buffer(KEY_LENGTH);
var iv=new Buffer(KEY_LENGTH);
for (var i=0; i<KEY_LENGTH; ++i) {
    key[i] = 32 + i;
    iv[i] = 0;
}

/*
var decipher = crypto.createDecipheriv('aes-128-cbc', key,iv);
var plainChunks = [];
for (var i = 0;i < cipherChunks.length;i++) {
    plainChunks.push(decipher.update(cipherChunks[i], 'hex','ascii'));

}
plainChunks.push(decipher.final('ascii'));
console.log(" plaintext deciphered: " + plainChunks.join(''));
*/

// prepare order data
var ProtoBuf = require("protobufjs");
var builder = ProtoBuf.loadProtoFile("./sale.order.proto"),
    sale = builder.build("sale"),
    Order = sale.order;
// order content
var jdata = require('./order.json');
var order = new Order(jdata);
var buffer = order.encode();
// encrypt order data
var cipher = crypto.createCipheriv('aes-128-cbc',key,iv);
var cipherChunks = [];
cipherChunks.push(cipher.update(buffer.toBuffer(),'binary','binary'));
cipherChunks.push(cipher.final('binary'));


var http = require('http');
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'application/octet-stream'});
    //res.write(buffer.toBuffer());
    res.write(cipherChunks.join(""),"binary");
    res.end();
    console.log('send data!')
}).listen(8001);
console.log('http server is running');
