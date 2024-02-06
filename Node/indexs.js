const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3100;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


app.use(bodyParser.json());

const users = [
    {
      username: 'John',
      email: 'john@abc.com',
      passwordHash: '$2a$12$rdsmRdZDl.QZEXGe5uVSGuhr1WUoFNKGimb4pQPVOnMqQzpTgyoa.', // Hash of 'Mansip2800'
    },
  ];

const jwt_secret = "your-256-bit-secret"
//Authorization: Basic BASE64_ENCODED_USERNAME_PASSWORD

const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Checking for authHeader",authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Unauthorized');
        return;
      }

     const token = authHeader.split(' ')[1];
     const result = jwt.verify(token, jwt_secret);
     console.log(result); 

    // base64Credentials = authHeader.split(' ')[1];
    // const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    // const [username, password] = credentials.split(':') ;

    const user = users.find((u) => u.username === result.name);
    console.log(user);
    if(!user){
        res.status(401).send('Unauthorized');
        return;
    }
    next();
}


app.get('/userdata', basicAuth,(req,res) => {
    res.send("You have access")

});


app.all('/userdataAll/:id',(req, res, next) => {
  console.log("Inside All....");
  // res.send(req.params);
  next();
})

app.get('/userdataAll/:id',(req, res, next) => {
  console.log("inside get...")
  res.send(req.params);
})

app.get('/userdata/:id/phone/:phoneid',(req, res) => {
  res.send(req.params);
})

app.get('/usdat+as/:id',(req, res) => {
  res.send(req.params);
})


app.get(/z{3}|x{3}/, (req, res) => {
  res.send({mess:"regex"})
})

app.post('/login',(req,res)=>{

  const user = users.find((u) => u.username === req.body.username);
  console.log(user);
  if(!user || !bcrypt.compareSync(req.body.password, user.passwordHash)){
    
    res.status(401).send({token:TOKEN});
    return;
  }
  jwtPayload = {
    name: user.username,
    email: user.email
  }

  const TOKEN = jwt.sign(jwtPayload, jwt_secret, {
    expiresIn:'1h',
  })
  res.status(200).json({token:TOKEN});
})



app.listen(PORT,()=>{
    console.log("Application started on port 3100")
})















// const express = require('express');
// const bcrypt = require('bcrypt');
// const app = express();
// const PORT = 3100;

// const users = [
//     {
//       username: 'exampleUser',
//       passwordHash: '$2a$12$.GgA0s4MCNH.hPB.xbmUduPppk6BKvEhE.lQIhYMysyLdo6V7FHjO', // Hash of 'mYpass876$'
//     },
//   ];

// //Authorization: Basic BASE64_ENCODED_USERNAME_PASSWORD

// const basicAuth = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Basic')) {
//         res.status(401).send('Unauthorized');
//         return;
//       }

//     base64Credentials = authHeader.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     const [username, password] = credentials.split(':') ;

//     const user = users.find((u) => u.username === username);
//     console.log(user);
//     if(!user || !bcrypt.compareSync(password, user.passwordHash)){
//         res.status(401).send('Unauthorized');
//         return;
//     }
//     next();
// }


// app.get('/userdata', basicAuth,(req,res) =>{
//     res.send("You have access")

// });

// app.listen(PORT,()=>{
//     console.log("Application started on port 3100")
// })














// // console.log("Hello World");

// const  express = require('express')
// const bodyparser = require('body-parser')
// const app = express()
// const port = 3001

// app.use(bodyparser.json())
// var users = [{
//     name: "Mansi",
//     city: "Mumbai"
// }]

// app.get("/user", (req, res) => {
//     res.send(users)
// })

// app.post("/user", (req,res) => {
//     var user = req.body
//     users.push(user)
//     res.status(201).send({msg:"User" + req.body.name + "added Successfully"});
// })

// app.listen(port, () => {
//     console.log("Web server started at port :" + port);
// })