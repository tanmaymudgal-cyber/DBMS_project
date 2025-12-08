'use server'

import mysql from 'mysql2/promise';
import { generateSQL, generateCompactSchema, summarizeResults } from '@/ai/simple-service';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export interface QueryResultState {
  id: string;
  query?: string;
  sql?: string;
  correctedSQL?: string;
  data?: any[];
  summary?: string;
  error?: string;
}

export async function handleQuery(
  previousState: QueryResultState,
  formData: FormData
): Promise<QueryResultState> {
  const userQuery = formData.get('query') as string;
  if (!userQuery) return { id: 'error', error: "Query cannot be empty" };

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [tables] = await connection.query('SHOW TABLES');
    const tableList = (tables as any[]).map(row => Object.values(row)[0]);

    const fullSchema = [];
    for (const tableName of tableList) {
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      fullSchema.push({ tableName, columns });
    }

    const compactSchema = generateCompactSchema(fullSchema);
    const generatedSql = await generateSQL(userQuery, compactSchema);

    const [rows] = await connection.query(generatedSql);

    const summary = await summarizeResults(userQuery, generatedSql, rows as any[]);

    return {
      id: Date.now().toString(),
      query: userQuery,
      sql: generatedSql,
      data: rows as any[],
      summary: summary,
    };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { id: 'error', error: error.message, query: userQuery };
  } finally {
    if (connection) await connection.end();
  }
}