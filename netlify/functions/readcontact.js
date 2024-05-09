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
    const [contacts] = await connection.query('SELECT * FROM contacts WHERE id = ?', [id]);
    await connection.end();
    if (contacts.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "contacts not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(contacts[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get contacts." ,  message: error.message}),
    };
  }
};
