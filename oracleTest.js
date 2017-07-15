/**
 * Created by itdev on 14-6-30.
 */
var oracle = require('oracle');

var connectData = {
    hostname: "192.168.0.108",
    port: 1521,
    database: "zswmis.orcl", // System ID (SID)
    user: "park",
    password: "park"
}

/*
var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=126.200.200.101)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=testmis.huijin.com)))";
var connectData = { "tns": connString, "user": "dep6", "password":"chk$n9" }
*/
oracle.connect(connectData, function(err, connection) {
    if (err) { console.log("Error connecting to db:", err); return; }

    connection.execute("SELECT sysdate FROM dual", [], function(err, results) {
        if (err) { console.log("Error executing query:", err); return; }

        console.log("result",results);
        connection.close(); // call only when query is finished executing
    });
});
