const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
 
  try {
    const  { id, first_name, last_name, email, phone, category_id } = JSON.parse(event.body);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const sql = 'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, category_id = ? WHERE id = ?';
    await connection.execute(sql,  [first_name, last_name, email, phone, category_id, id]);
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "contacts updated successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update contacts.",  message: error.message }),
    };
  }
};
