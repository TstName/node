var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const crypto = require('crypto');
var vm = require('vm');
var connection;
function handleError(){
	connection = mysql.createConnection({
		host:"localhost",
		user:"sizhan",
		password:"tst88888888",
		port:"3306",
		database:"sizhan"
	})
	 connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError, 2000);
        }
    });
 
    connection.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();
connection.connect(()=>{
	console.log( __filename );
	console.log( __dirname );
	var testcases = [];
	for (var i = 0; i < 1000; i++) {
	    var a = Math.random() * 1000;
	    var b = Math.random() * 1000;
	    testcases.push({
	        input: {
	            a: a,
	            b: b
	        },
	        output: {
	            ans: a + b,
	        }
	    })
	}
	var code = 'ans = a + b + (a < 5 ? 1: 0)'; 
	testcases.forEach((e, i) => {
	    var sandbox = vm.createContext(e.input);
	    vm.runInContext(code, sandbox, {time: 1000}); // time limit: 1000ms
	    for(var key in e.output){
	        if(e.output[key] != sandbox[key]){
	            break;
	        }
	    }    
	})
});
router.get('/', function(req, res) {
	var  sql = 'SELECT * FROM password';
	connection.query(sql,(error,result)=>{
		if(!error){
			res.json({status:200,data:result,message:"获取成功"})
		}else{
			res.json({status:400,message:"获取失败"})
		}
	})
});
router.get('/banner', function(req, res) {
	var  sql = 'SELECT * FROM banner';
	connection.query(sql,(error,result)=>{
		if(!error){
			res.json({status:200,data:result,message:"获取成功"})
		}else{
			res.json({status:400,message:"获取失败"})
		}
	})
});
function aesEncrypt(data, key) {
const cipher = crypto.createCipher('aes192', key);
var crypted = cipher.update(data, 'utf8', 'hex');
crypted += cipher.final('hex');
return crypted;
}

function aesDecrypt(encrypted, key) {
const decipher = crypto.createDecipher('aes192', key);
var decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
return decrypted;
}
function change(){
	crypto.createHmac
}
router.get('/add', function(req, res) {
	var sql = 'INSERT INTO password(password,account) VALUES(?,?)';
	req.query.password = aesEncrypt(req.query.password,'I LOVE NODE')
	let {password,account} = req.query
	
	connection.query(sql,TForObject({password,account}),(error,result)=>{
		if(!error){
			res.json({status:200,message:"注册成功"})
		}else{
			res.json({status:400,message:"注册失败"})
		}
	})
});
router.get('/delete', function(req, res) {
	var sql = `DELETE FROM password where id=${req.query.id}`;
	connection.query(sql,(error,result)=>{
		if(!error){
			res.json({status:200,message:"删除成功"})
		}else{
			res.json({status:400,message:"删除失败"})
		}
	})
});
router.get('/change', function(req, res) {
	var sql = `UPDATE password SET password=? where id=${req.query.id}`;
	connection.query(sql,[req.query.password],(error,result)=>{
		if(!error){
			res.json({status:200,message:"修改成功"})
		}else{
			res.json({status:400,message:"修改失败"})
		}
	})
});
function TForObject(obj){
	var arr = []
	for(key in obj){
		arr.push(obj[key])
	}
	return arr;
}
module.exports = router;
