let http = require('http');
let fs = require('fs');
let mysql = require('mysql2');
let qs = require('querystring');
let Cookies = require('cookies');

let url = '';
let method = '';
let contentType = '';
let body = '';
let cookie = '';
var keys = [''];

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "DB"
});

connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

http.createServer(function(request, response) {
    var cookies = new Cookies(request,response,{ keys: keys });
    url = request.url;
    method = request.method;
    console.log(url);
    console.log(method);
    if (method == "GET") {
        if(url =='/') url='/main.html';
        fs.readFile('SpennendeSafa' + url, (error, fileContent) => {
            contentType = 'text/html';
            console.log('1: ' + url + ' ' + contentType);
            if (url.endsWith('.css')) contentType = 'text/css';
            if (url.endsWith('.js')) contentType = 'text/javascript';
            if (url.endsWith('.png')) contentType = 'image/png'; 
            if (url.endsWith('.jpeg')) contentType = 'image/jpeg'; 

            response.setHeader('Content-Type', contentType);
            console.log('2: ' + url + ' ' + contentType);
            if (!error) { // страница существует
                response.statusCode = 200;
                response.write(fileContent);
                console.log('3: ' + url + ' ' + contentType);
                response.end();
            } else { // страница не найдена
                /*fs.readFile('SpennendeSafa/404.html', (error404, fileContent404) => {
                    if(error404) throw error404;
                    response.statusCode = 404;
                    response.write(fileContent404);
                    response.end();
                });*/
             response.statusCode = 404; 
             response.setHeader('Content-Type', 'text/plain');
             response.write('404 not found');
             response.end();
            }
        });
    }
    else
    {   body="";
        request.on('data', function(data){
            body += data;
            if (body>1e6) request.destroy();
        });
        request.on('end', function () {
            console.log('POST body ' + body);
            var post = qs.parse(body);
            console.log(post);
            switch(post['formServices']){
                case 'registration':
                    var sql = "insert into users(email, password)" +
                    "values ('" + post['email'] + "','"+ post['psw1'] +"');" ;
                        connection.connect(function(err){
                            if(err) throw err;
                            console.log("Connected!");
                            connection.query(sql, function(err, result){
                                if(err) throw err;
                                console.log("1 record inserted");
                                connection.end();
                            });
                        });
                break;
                case 'login':
                    var sql = "select * from users where email='" + post['email'] + "' and password='" + post['psw'] +"';";
                    connection.connect(function(err){
                        if(err) throw err;
                        console.log('Connect checking login');
                        connection.query(sql, function(err, result){
                            if(err) throw err;
                            console.log(result);
                            if(result.length == 1) {
                                cookie = post['email'];
                                console.log('Check ' + cookie);
                                connection.end();
                                }
                            });
                        });
                    
                break;
                
                default: console.log("Some problem with POST");
                }
            console.log("add cookies");     
            
            
            fs.readFile('SpennendeSafa/login.html',(error,fileContent)=>{
                response.setHeader('Content-Type','text/html');
                if(!error){
                    cookies.set('user',cookie, {httpOnly:false});
                    response.statusCode = 200;
                    response.write(fileContent);
                    response.end();
                }
            });
            
        });
    }
}).listen(3000, () => console.log('Server is working'));