const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {


    const requestBody = JSON.parse(event.body);
    const { contact_id, note } = requestBody;

  
    if (!contact_id || !note) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters (contact_id, note).' }),
      };
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

   
    const query = 'INSERT INTO notes (contact_id, note) VALUES (?, ?)';


    const [result] = await connection.execute(query, [contact_id, note]);

    
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


