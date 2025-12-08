import { ai } from './genkit';

export function generateCompactSchema(tables: any[]): string {
  if (!tables || tables.length === 0) return "No tables found.";
  
  return tables.map(t => {
    const tableName = t.tableName || Object.values(t)[0];
    const columns = t.columns || [];
    
    const colStr = columns.map((c: any) => c.name || c.Field).join(", ");
    return `${tableName}(${colStr})`;
  }).join("; ");
}

export async function generateSQL(userPrompt: string, dbSchema: string) {
  try {
    const systemPrompt = `You are an expert MySQL database analyst. Generate a precise, efficient SQL query.

DATABASE SCHEMA:
${dbSchema}

REQUIREMENTS:
- Write valid, optimized MySQL syntax
- Return ONLY the raw SQL query, no markdown or code blocks
- Use appropriate JOINs, WHERE clauses, and aggregations
- Return ALL relevant rows (unless user specifies a limit)
- Use proper GROUP BY with aggregations
- Format query for clarity

USER QUESTION:
${userPrompt}`;

    const response = await ai.generate({
      prompt: systemPrompt,
    });

    let sql = response.text.trim();
    sql = sql.replace(/```sql/g, "").replace(/```/g, "").trim();
    sql = sql.replace(/LIMIT\s+\d+/gi, "");
    
    return sql;

  } catch (error: any) {
    console.error("Genkit API Error:", error.message);
    
    if (error.message.includes("429") || error.message.includes("quota")) {
      throw new Error("Too many requests. Please wait 1 minute and try again.");
    }
    throw new Error("AI Service Error: " + error.message);
  }
}

export async function summarizeResults(userQuestion: string, sqlQuery: string, queryResults: any[]): Promise<string> {
  try {
    if (!queryResults || queryResults.length === 0) {
      return "No results to summarize.";
    }

    const totalRows = queryResults.length;
    const sampleData = queryResults.slice(0, 3);
    
    const summaryPrompt = `Analyze this data and respond with ONLY the following structure. No extra text.

Data: ${JSON.stringify(sampleData)}
Total rows: ${totalRows}
Question: ${userQuestion}

Response format (use these exact headers):

OVERVIEW
[One sentence]

KEY STATISTICS
Total Records: ${totalRows}
[One more statistic from the data]

KEY FINDINGS
[First finding]
[Second finding]

INSIGHTS
[One important insight]`;

    const response = await ai.generate({
      prompt: summaryPrompt,
    });

    let summary = response.text.trim();
    summary = summary.replace(/#+\s/g, "").replace(/\*+/g, "").replace(/`+/g, "");
    
    const lines = summary.split('\n').filter((line: string) => line.trim().length > 0);
    
    const formatted = lines.map((line: string, index: number) => {
      const trimmed = line.trim();
      const isHeader = /^(OVERVIEW|KEY STATISTICS|KEY FINDINGS|INSIGHTS|Total Records)/.test(trimmed);
      
      if (isHeader && index > 0) {
        return '\n' + trimmed;
      }
      return trimmed;
    }).join('\n');
    
    return formatted;

  } catch (error: any) {
    console.error("Summary Error:", error.message);
    return "Unable to generate summary.";
  }
}