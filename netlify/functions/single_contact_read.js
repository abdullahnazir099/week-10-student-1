const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {

  

    const { id } = event.queryStringParameters;

 
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const query = 'SELECT * FROM contacts WHERE id = ?';


    const [rows] = await connection.execute(query, [id]);

  
    await connection.end();

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Contact not found" })
      };
    }


    return {
      statusCode: 200,
      body: JSON.stringify(rows[0])
    };
  } catch (error) {

    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to read contact", details: error.message })
    };
  }
};


