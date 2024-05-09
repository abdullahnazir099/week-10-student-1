const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {

   

  
    const  { contact_id, note}  = JSON.parse(event.body);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const sql =  'INSERT INTO notes (contact_id, note) VALUES (?, ?)';
    await connection.execute(sql, [contact_id, note] );
    await connection.end();
   
   

    
    if (result.affectedRows !== 1) {
      throw new Error('Failed to create note.');
    }


    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Note created successfully' })
    };
  } catch (error) {

    console.error('Error creating note:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create note', details: error.message })
    };
  }
};


