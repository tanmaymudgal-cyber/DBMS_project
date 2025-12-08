import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,  
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let schemaCache: string | null = null;
  
export const getDbSchema = async (): Promise<string> => {
  if (schemaCache) {
    return schemaCache;
  }

  try {
    const connection = await pool.getConnection();
    const [tables]: any = await connection.query('SHOW TABLES');
    const tableNames = tables.map((row: any) => Object.values(row)[0]);

    const schema: any = { tables: {} };

    for (const tableName of tableNames) {
      const [columns]: any = await connection.query(`DESCRIBE \`${tableName}\``);
      const columnDetails: any = {};
      columns.forEach((col: any) => {
        columnDetails[col.Field] = col.Type;
      });

      schema.tables[tableName] = {
        columns: columnDetails
      };
    }

    connection.release();
    schemaCache = JSON.stringify(schema, null, 2);
    return schemaCache;
  } catch (error: any) {
    console.error('Failed to fetch database schema:', error);
    return JSON.stringify({
      error: 'Could not connect to the database to fetch schema.',
      tables: {
        sales: {
          columns: {
            id: 'INT',
            product: 'VARCHAR',
            quantity: 'INT',
            price: 'DECIMAL',
            sale_date: 'DATETIME',
            region: 'VARCHAR',
          },
        },
      }
    }, null, 2);
  }
};

export const executeQuery = async (sql: string): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql);
    return { success: true, data: rows as any[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
