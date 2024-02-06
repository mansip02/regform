const {Pool} = require('pg');

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

// const test = async() => {
//     const res = await pool.query("SELECT * FROM mansi");
//     console.log("Result", res.rows);    
// }

// const create = async() => {
//     const queryText = 
//     `CREATE TABLE IF NOT EXISTS mansi (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100),
//         email VARCHAR(100)
//     )`;
//     // const res = await pool.query(queryText)
//     try {
//         const res = await pool.query(queryText);
//         console.log('Table created successfully');        
//     } catch (err) {
//         console.error('Error creating table:', err);
//     }
// }

const getUser = async () => {
    try { 
        const res = await pool.query('SELECT * FROM mansi');
        console.log("Users:", res.rows);
    } catch (err) {
        console.log('Error fetching users', err);
    }
};

const addUser = async (name, email) => {
    try{
        const res = await pool.query('INSERT INTO mansi (name, email) VALUES ($1, $2) RETURNING * ', [name, email]);
        console.log('New User:', res.rows);  
    } catch (err) {
        console.error('Error adding user:', err);
    }
};

addUser("Mansi","mansi123@gmail.com")
getUser()
// create();
// test();


// const main = async() =>{
//     await addUser("Mansi","mansi123@gmail.com")
//     await getUser()
// }
// main()