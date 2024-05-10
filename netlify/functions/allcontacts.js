const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  if (!context.clientContext || !context.clientContext.user) {
    return {
    statusCode: 401,
    body: JSON.stringify({ error: 'You must be logged in.' }),
    };
    }
    
    const user = context.clientContext.user;
  
    console.log('Authenticated user:', user);
 
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [contacts] = await connection.query('SELECT * FROM contacts');
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(contacts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get contacts.",  message: error.message }),
    };
  }
};
