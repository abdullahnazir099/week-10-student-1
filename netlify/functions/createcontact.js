const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
 
  try {
    const  { first_name, last_name, email, phone, category_id }  = JSON.parse(event.body);
 
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const sql =  'INSERT INTO contacts (first_name, last_name, email, phone, category_id) VALUES (?, ?, ?, ?, ?)';
    await connection.execute(sql, [first_name, last_name, email, phone, category_id] );
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "contact created successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create contact." }),
    };
  }
};
