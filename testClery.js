/**
 * Created by itdev on 16-6-15.
 */
var celery = require('node-celery');
    client = celery.createClient({
        CELERY_BROKER_URL: 'amqp://',
        CELERY_RESULT_BACKEND: 'amqp',
        TASK_RESULT_EXPIRES:'3600'
    });

client.on('connect', function() {
    var result = client.call('testcelery.tasks.add', [100, 2]);

    result.on('ready', function(data) {
        console.log(data);
        console.log(result);
        //client.end();
    });

});

