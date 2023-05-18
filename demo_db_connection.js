const http = require('http');
const fs = require('fs');

var qs = require('querystring');
var wp = '';
var jsFile = '';
var cssFile = '';

var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

/*let sql = "select * from users;";

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function(err, result){
    if (err) throw err;
    console.log(result[1].name);
  })
});*/

http.createServer((req, res) => {
  switch (req.url){ 
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'})
        file = fs.readFileSync('./index.html')
        res.end(file)

      case '/main.css':
         res.writeHead(200, {'Content-Type': 'text/css'})
         fs.readFile('./main.css', (err, data)  => {
          if (err) throw err
            cssFile = data})
         res.end(cssFile)

      case '/index.js':
        fs.readFile('./index.js', (err, data) =>{ 
          if (err) throw err
            jsFile = data
        })
        res.writeHead(200, {'Content-Type':'text/javascript'})
        res.end(jsFile)

      case '/localhost.html':
        if( req.method == 'POST'){ 
          var body = ''
          req.on('data', function(data){
            body += data
            if (body > 1e6) req.connection.destroy()
          })
          req.on('end', function(){
            var post = qs.parse(body)
            var sql = "insert into users (name, email, password, country, dateBirth)" + "values ('" + post['name'] + "','" + post['email'] + "','1111', '1','1995-01-01');"

            con.connect(function(err){
              if (err) throw err;
              console.log("Connected!")
              con.query(sql, function(err, result){
                if (err) throw err;
                console.log("1 record inserted")
              })
            })

            wp = "document.write('Welcome "+ post['name'] + "!')"

          })
        }

        res.writeHead(200, {'Content-Type':'text/html'})
        file = fs.readFileSync('./localhost.html')
        res.end(file);

        case '/WP.js':
         res.writeHead(200, {'Content-Type':'text/js'})
         res.end(wp);
         default:
         res.writeHead(404, {'Content-Type':'text/plain'})
         res.end('404 Не найдено');
  }
}).listen(3000, ()=> console.log('Server is working'));