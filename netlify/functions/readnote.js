const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {

 


    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });


    const query = 'SELECT * FROM notes';


    const [rows] = await connection.execute(query);

  
    await connection.end();


    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };
  } catch (error) {

    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read notes', details: error.message })
    };
  }
};

