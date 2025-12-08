# **App Name**: MongoInsight

## Core Features:

- Schema Indexing: Automatically scan MongoDB collections to extract schema (fields, data types) and sample documents; embed into ChromaDB for schema RAG.
- Natural Language Querying: Accept complex natural language queries from users, parsing intent.
- Aggregation Pipeline Generation: Translate natural language queries into optimized MongoDB Aggregation Pipelines using Gemini 3 Pro.
- Execution & Guardrails: Execute the generated Aggregation Pipeline against a live MongoDB database, ensuring read-only operations by rejecting pipelines with $out, $merge, or $delete.
- Self-Correction Mechanism: Automatically capture PyMongo errors, feed them back to Gemini 3 Pro for pipeline correction (max 3 retries), uses an LLM-powered tool.
- Data Visualization: Render query results in a dynamic HTML table for detailed analysis.
- Insight Generation: Generate a natural language summary of the data insights extracted by the LLM.

## Style Guidelines:

- Primary color: Dark gray (#333333) to provide a terminal-like feel.
- Background color: Very dark gray (#1A1A1A) to mimic a terminal environment.
- Accent color: Bright cyan (#00FFFF) for prompts and highlights.
- Body and headline font: 'Space Grotesk', a sans-serif, for a modern, computerized look. 
- Code font: 'Source Code Pro' for displaying MongoDB pipelines and code snippets.
- Dual-pane output: "The Insight" (natural language summary) and "The Evidence" (raw JSON data).
- Subtle typing animations when the LLM generates insights or when query results are loaded.