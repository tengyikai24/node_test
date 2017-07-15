/**
 * Created by itdev on 16-6-22.
 */

process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});

var amqp = require('amqplib/callback_api');

//log errro
function log_error(err){
    console.log(err);
    process.exit(1);
}
//do you job
function doJob(msg){
    //do price change here,if success ,return true
    if(msg==null){
        console.log(" msg is null, queue error");
        return false;
    }
    console.log(" [x] Received %s", msg.content.toString());
    return true;
}



amqp.connect('amqp://hjuser:hjpassw0rd@126.200.168.10:5670/hj', function(err, conn) {
    if(err==null){
    conn.createChannel(function(err, ch) {
        if (err!=null)
            log_error(err);
        var q = 'emec_adjust_price';
        var ex = 'emec_exchange';
        var r = 'adjust_price.key';
        ch.assertExchange(ex,'direct',{durable:true,alternateExchange:"default"});

        ch.assertQueue(q, {durable: true});
        ch.bindQueue(q,ex,r);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg){
            //if the job is executed successfully, send the ack to RabbitMQ. If you the RabbitMQ needn't to care it,set the noAck with ture
            if(doJob(msg)){
                ch.ack(msg);
            }
            else{
                console.log("execute   error, re declare queue");

            }

        }, {noAck: false},function(err,ok){
            if(err!=null){
                console.log(err.toString());
            }
        });

    });

    conn.createChannel(function(err, ch) {
            if (err!=null)
                log_error(err);
            var q = 'default';
            var ex = 'default';
            var r = '';
            ch.assertExchange(ex,'fanout',{durable:false});
            ch.assertQueue(q, {durable: true});
            ch.bindQueue(q,ex,r);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, function(msg) {
                //if the job is executed successfully, send the ack to RabbitMQ. If you the RabbitMQ needn't to care it,set the noAck with ture

                console.log("default  "+msg.content.toString());
                ch.ack(msg);

            }, {noAck: false});

    });
    }
    else{
        console.log("ampq connect error\n");
    }
});



var http = require('http');
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(Date.now().toLocaleString());
    res.end();
}).listen(8001);
console.log('http server is running');



