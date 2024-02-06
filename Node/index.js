const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3100;
const cors = require("cors")

const pool = new Pool({
    user: 'hkclass',
    host:'ls-82a7e1e73dbc6b891561175a6721b93bcc976ec0.cjwakx4kq2ub.ap-south-1.rds.amazonaws.com',
    database: 'Hktraning',
    password: 'hk@123',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors());

app.use(bodyParser.json());

const jwt_secret = "your-256-bit-secret"

// const authenticateToken = (req, res, next) => {
//     console.log("abc");
//   const token = req.header('Authorization');
//   if (!token) return res.sendStatus(401);

//   const TOKEN = token.split(' ')[1];

//   jwt.verify(TOKEN, jwt_secret, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
//   console.log("xyz");
// };

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Access denied');
    }
    const encToken = token.split(' ')[1];
    jwt.verify(encToken, jwt_secret, (err, user) => {
        if (err) {
            console.log("Invalid", err)
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
}

app.use(express.json());

const test = async() => {
        const res = await pool.query("SELECT * FROM MansiLoginDetails"); 
        console.log("Result", res.rows);    
    }

const createuser = async() => {
    const queryText = 
    `CREATE TABLE IF NOT EXISTS MansiLoginDetails (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        password VARCHAR(100)
    )`;
    try {
        const res = await pool.query(queryText);
        console.log('Table created successfully');        
    } catch (err) {
        console.error('Error creating table:', err);
    }
}    


app.post('/reg', async (req, res) => {
    const {username, password} = req.body;
    console.log("abc",req.body);
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    try{
        await pool.query('INSERT INTO MansiLoginDetails (username, password) VALUES ($1, $2) RETURNING * ', [username, passwordHash]);
        res.status(200).send('User Registerd');
        console.log("Register successfull");
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ err: 'Server error'});
    }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const userResult = await pool.query('SELECT * FROM MansiLoginDetails WHERE username = $1', [username]);

  if (userResult.rows.length === 0) {
    res.status(200).send('User already exists');
    return;
  }

  const user = userResult.rows[0];
  const pass = await bcrypt.compare(password, user.password);

  if(!pass){
    res.status(200).send('invalid');
    return;
  }

  const accessToken = jwt.sign(user, jwt_secret);

  
  
  res.json({ accessToken });
});
const test1 = async() => {
    const res = await pool.query("SELECT * FROM BookDetails"); 
    console.log("Result", res.rows);    
}

const create = async() => {
        const queryText = 
        `CREATE TABLE IF NOT EXISTS BookDetails (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100),
            author VARCHAR(100)
        )`;
        try {
            const res = await pool.query(queryText);
            console.log('Table created successfully');        
        } catch (err) {
            console.error('Error creating table:', err);
        }
    }

// Endpoint to add a book (requires authentication)
// app.post('/addbook', authenticateToken, async (req, res) => {
//     try{
//         const { title, author } = req.body;

//         // Insert new book into the database
//         await pool.query('INSERT INTO BookDetails(title, author) VALUES($1, $2) RETURNING *', [title, author]);

//         res.status(201).send('Book Added');
//     } catch (error) {
//         console.error("mansi",error);
//         res.status(500).send('Server Error');
//     }
// });
app.post('/addBooks', authenticateToken, async (req, res) => {
    try {
        const { title, author } = req.body;
        await pool.query('INSERT INTO BookDetails (title, author) VALUES ($1, $2)', [title, author]);

        res.status(201).send('Book added successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/books', authenticateToken, async (req, res) => {
    try{
    const getBooksResult = await pool.query('SELECT * FROM BookDetails');
    const book = getBooksResult.rows;
    res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// createuser()
 test()
// test1()








// const express = require('express');
// const app = express();
// const bcrypt = require("bcrypt");
// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "hkclass",
//   host: "ls-82a7e1e73dbc6b891561175a6721b93bcc976ec0.cjwakx4kq2ub.ap-south-1.rds.amazonaws.com",
//   database: "Hktraning",
//   password: "hk@123",
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const createUser = async () => {
//   const query = `CREATE TABLE prac (id SERIAL PRIMARY KEY,name VARCHAR(100), password VARCHAR(100))`;
//   try {
//     const res = await pool.query(query);
//     console.log("User Created");
//   } catch (err) {
//     console.log("Error Creating User", err);
//   }
// };

// app.post("/reg", async (req, res) => {
//   const { username, password } = req.body;
//   const hp = await bcrypt.hash(password, 10);
//   try {
//     const req = await pool.query(
//       "INSERT INTO Login (username,password) VALUES ($1, $2)",
//       [username, hp]
//     );
//     console.log("User Registered");
//   } catch (errr) {
//     console.log("Error inserting", errr);
//   }
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const log = await pool.query("SELECT * FROM Login WHERE username = $1", [
//     username,
//   ]);
//   if (log.rows.length === 0) {
//     res.status(400).send("user already exist");
//     return;
//   }
//   const user = log.rows[0];
//   const pass = await bcrypt.compare(password, user.password);

//   if (!pass) {
//     res.status(401).send("invalid");
//     return;
//   }

//   const accessToken = jwt.sign(user, jwt_secret);

//   res.join({ accessToken });
// });

// const getUser = async () => {
//   const get = await pool.query("SELECT * FROM prac");
//   console.log("Result", get.rows);
// };

// // insertUser("mansi","mansi123")

// // getUser();
