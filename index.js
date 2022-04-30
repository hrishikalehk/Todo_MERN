
// Import
const express = require ("express");
const bodyParser = require ("body-parser");
const bcryptjs = require("bcryptjs")
let axios = require ("axios");
// const Connection = require('mysql/lib/Connection');

require('dotenv').config()

const port = process.env.PORT;
const mysql = require('mysql');
const bcrypt = require("bcryptjs/dist/bcrypt");

let app = express();
app.set("view engine","ejs");

app.use(bodyParser.json())
app.use (bodyParser.urlencoded({extended:true}));


const Connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rezolut@123",
    database : "ToDo"
  });

  Connection.connect(function(error){
      if(!!error)console.log(error);
      else console.log("Database connected");
  })


app.get('/listTodo',function(req,res)
{   var  Hrishikesh = 0;
    var Manish = 0;
    var Darshan = 0;
    var Ashutosh = 0;
    var hold= 0;
    var done=0;
    var progress=0;
    var backlog =0;
    let sql = "SELECT * from TodoList";
    let query = Connection.query(sql,(err,result) =>  {
        if (err) throw err;
        result.forEach ((loop1) =>{
          if (loop1.assignto === "Hrishikesh"){
              Hrishikesh = Hrishikesh +1
          }else if (loop1.assignto === "Manish"){
              Manish = Manish +1
          }else if (loop1.assignto === "Darshan"){
              Darshan = Darshan +1
          }else if (loop1.assignto === "Ashutosh"){
              Ashutosh = Ashutosh +1
          }
           

        })
      result.forEach((loop) => {
        //   console.log(loop.task_status);
          if(loop.task_status === "On Hold"){
              hold = hold+1
          }else if (loop.task_status === "Backlog"){
              backlog=backlog+1
          }else if (loop.task_status === "Done"){
            done=done+1
          }else if (loop.task_status === "On Progress"){
            progress=progress+1
          }
        
        
          
      });

        res.render('listTodo',{listitem:result,hold:hold,progress:progress,done:done,backlog:backlog,Hrishikesh:Hrishikesh,Manish:Manish,Darshan:Darshan,Ashutosh:Ashutosh});
    })
})

app.get('/todo',function(req,res){
    res.render('todo')
})

app.get('/todo/edit/:taskid',(req, res) => {
    const taskid = req.params.taskid;
    let sql = `Select * from TodoList where taskid = ${taskid}`;
    let query = Connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('todo_edit', { dolist:result[0]
            
        });
    });
});


app.post('/todo', function (req,res){
    var task = req.body.taskname;
    var assign = req.body.assignto;
    var task_status = req.body.task_status;
    let sqlQuery = `insert into TodoList(taskname,assignto,task_status) values("${task}","${assign}","${task_status}")`;
    let query = Connection.query(sqlQuery, (err, results) => {
      if(err) throw err;
    });
    res.redirect('/listTodo');
});
app.post('/update',(req, res) => {
    const taskid = req.body.taskid;
    let sql = "update TodoList SET taskname='"+req.body.taskname+"', assignto='"+req.body.assignto+"', task_status='"+req.body.task_status+"' where taskid ="+taskid;
    let query = Connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/listTodo');
    });
});

app.get('/todo/delete/:taskid',(req, res) => {
    const taskid = req.params.taskid;
    let sql = `DELETE from TodoList where taskid = ${taskid}`;
    let query = Connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/listTodo');
    });
});
    
app.get('/',(req,res)=>{
        res.render('signup')
});

app.post('/signup', async function (req,res){
    var username = req.body.username;
    var password = req.body.password;
    let salt=await bcrypt.genSalt(8)
    let hashed=await bcrypt.hash(password,salt)
    console.log(hashed)
    let sqlQuery = `insert into logintable (username,password) values("${username}","${hashed}")`;
    let query = Connection.query(sqlQuery, (err, results) => {
      if(err) throw err;
    });
    res.redirect('/login');

});
app.get('/login',(req,res)=>{
    res.render('login')
});

app.post('/login',function(req,res){
    console.log(req.body)
 var Uname = req.body.Uname;
 var Pass = req.body.Pass;
 let sqlQuery = `select * from logintable where username = "${Uname}"`;
 let query = Connection.query(sqlQuery,async (err , result)=>{
     let isMatch = await bcrypt.compare(Pass,result[0].password)

     if (isMatch){
         res.redirect('/todo')
     }
         else{
             console.log("invalid input")
            //  res.redirect('/login')
         }
        })

 })




app.listen(port,()=>{
    console.log('server running')
})

