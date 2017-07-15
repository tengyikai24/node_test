/**
 * Created by itdev on 16-6-13.
 */
var ldap = require("ldapjs");

var  uid='002002';
var  pwd='abc456';
var baseDN='ou=people,dc=xjhscgf,dc=com';
var  userDN = 'uid='+uid+','+baseDN;

//创建LDAP client，把服务器url传入
var client = ldap.createClient({
    url: 'ldap://126.200.168.1:1389'
});

//创建LDAP查询选项
//filter的作用就是相当于SQL的条件
var opts = {
    filter: '(uid='+uid+')', //查询条件过滤器，查找uid=kxh的用户节点
    scope: 'sub',    //查询范围
    timeLimit: 500 ,   //查询超时
    attributes: [  'cn','employeeNumber']
};

//将client绑定LDAP Server
//第一个参数：是用户，必须是从根节点到用户节点的全路径
//第二个参数：用户密码
client.bind(userDN,pwd, function (err, res1) {

    if(err){
        console.log(err);
    }
    else{
    client.search(baseDN, opts, function (err, res2) {

        res2.on('searchEntry', function (entry) {
            var user = entry.object;
            var userText = JSON.stringify(user,null,2);
            console.log(userText);

        });

        res2.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
        });

        //查询错误事件
        res2.on('error', function(err) {
            console.error('error: ' + err.message);
            //unbind操作，必须要做
            client.unbind();
        });

        //查询结束
        res2.on('end', function(result) {
            console.log('search status: ' + result.status);
            //unbind操作，必须要做
            client.unbind();
        });

    });
    }
});
