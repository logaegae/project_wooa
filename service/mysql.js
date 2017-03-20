/**
 * DB Connection 설정
 */
var mysql = require('mysql');

//DB 연결문 ㅣ 설정 필요
var connection = mysql.createConnection({
	host : process.platform === "win32" || process.platform === "darwin" ? "i-make.kr" : "localhost",
	port : 3306,
	user : 'root',
	password : 'acac1202',
	database : 'wooa',
	charset: 'utf8'
});

module.exports = connection;
