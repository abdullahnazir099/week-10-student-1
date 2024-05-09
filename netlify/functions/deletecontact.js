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

    const sql = 'DELETE FROM contacts WHERE id = ?';
    await connection.execute(sql, [id]);
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "contact deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "error to delete contact.",  message: error.message }),
    };
  }
};
