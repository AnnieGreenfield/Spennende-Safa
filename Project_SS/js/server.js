const http = require('http');
const fs = require('fs');
var mysql = require('mysql2');
var qs = require('querystring');
var Cookies = require('cookies');


let jsFile = '';
let cssFile = '';
let cookie = '';
var keys = [''];


var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "Project"
});

 connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });


http.createServer((req,res) =>{
	var cookies = new Cookies(req,res,{ keys: keys });
	switch(req.url){
	case '/':
		if(req.method=="POST"){
			let body = '';
			console.log("POST");
			req.on('data', function(data){
				body += data;
				if(body>1e6) req.connection.destroy();
			});
			
			console.log('POST body' + body);
			
			req.on('end', function(){
    			var post = qs.parse(body);
    			console.log(post);
    			switch(post['type']){

    				case 'registration':
    					var sql = "insert into users(login, password)" +
    					"values ('" + post['Login'] + "','"+ post['Password'] +"');" ;
    					connection.connect(function(err){
    					if(err) throw err;
    					console.log("Connected!");
    					connection.query(sql, function(err, result){
    						if(err) throw err;
    						console.log("1 record inserted");
    						});
    					});
    				break;
    				case 'login':
    					var sql = "select * from users where login='" + post['Login'] + "' and password='" + post['Password'] +"';";
    					connection.connect(function(err){
    						if(err) throw err;
    						console.log('Connect checking login');
    						connection.query(sql, function(err, result){
    							if(err) throw err;
    							console.log(result);
    							if(result.length == 1) {

    							cookie = post['Login'];
    							console.log('Check ' + cookie);
    							}
    						});
    					});
    				break;
    			default: console.log("Some problem with POST");
    			}
    		})
			console.log("add cookies");		
			cookies.set('user',cookie, {httpOnly:false});
			res.writeHead(200, {'Content-Type':'text/html'});
			file = fs.readFileSync('..//index.html');
			res.end(file);

		} else
		{
			console.log("First point");
			res.writeHead(200, {'Content-Type':'text/html'});
			file = fs.readFileSync('..//index.html');
			res.end(file);
		}
	break;
	
	case '/login.js':
		fs.readFile('../js/login.js', (err,data)=>{
			if(err)throw err;
			jsFile = data;
		});
		res.writeHead(200, {'Content-Type':'application/javascript'});
		res.end(jsFile);
	break;
	case '/style.css':
		fs.readFile('../css/style.css', (err,data)=>{
			if(err)throw err;
			cssFile = data;
		});
		res.writeHead(200, {'Content-Type':'text/css'});
		res.end(cssFile);
	break;
    
	default:
		res.writeHead(404, {'Content-Type':'text/plain'});
		res.end('404 Not found');
	}
}).listen(3000, () => console.log('Server is working'));

/*connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение закрыто");
});
*/