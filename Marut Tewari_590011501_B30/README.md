# SQLInsight: AI-Powered MySQL Analytics Agent

An intelligent web application that converts natural language questions into SQL queries, executes them against your MySQL database, and returns results in both human-readable and tabular formats.

## Features

- Natural language to SQL conversion using Google's Gemini AI
- Automatic schema introspection from your database
- Structured query result summarization
- Real-time query execution
- Clean, modern UI with dark mode support
- Support for complex queries (JOINs, GROUP BY, aggregations)

## Prerequisites

Before you begin, ensure you have:
- [Node.js](https://nodejs.org/) (v18 or later)
- npm or yarn
- A running MySQL server (v5.7 or later)
- Google Gemini API key

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

**To get a Gemini API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key and copy it to your `.env` file

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## How It Works

1. **Natural Language Input**: Enter a question about your data in plain English
   - Example: "Show me the average salary by department"

2. **AI SQL Generation**: Gemini converts your question to SQL
   - You can see the generated SQL in "The Evidence" section

3. **Query Execution**: The SQL is executed against your database

4. **Result Display**: Results shown in two formats:
   - **The Insight**: Human-readable AI summary of findings
   - **The Evidence**: Generated SQL and raw data table

## Monitoring Queries

To see all executed queries in MySQL Workbench:

### Enable General Query Log

```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';
```

### View Executed Queries

```sql
SELECT event_time, command_type, argument 
FROM mysql.general_log 
ORDER BY event_time DESC 
LIMIT 50;
```

### Disable General Log (when done)

```sql
SET GLOBAL general_log = 'OFF';
```

## Project Structure

```
src/
├── app/
│   ├── actions.ts          # Server actions for query handling
│   ├── page.tsx            # Main page component
│   ├── layout.tsx          # Layout wrapper
│   └── globals.css         # Global styles
├── ai/
│   ├── genkit.ts           # Genkit AI initialization
│   ├── simple-service.ts   # SQL generation and summarization
│   └── flows/              # Additional AI flows
├── components/
│   └── ui/                 # Reusable UI components
└── lib/
    └── utils.ts            # Utility functions
```

## Available Scripts

```bash
npm run dev          # Start development server on port 9002
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript types
```

## Configuration

### Database Support

Currently supports MySQL. The application:
- Automatically detects all tables in your database
- Reads column names and types
- Generates appropriate queries based on your schema

### Model Selection

To change the AI model, edit `src/ai/genkit.ts`:

```typescript
model: 'googleai/gemini-2.5-pro',  // Change to desired model
```

## Troubleshooting

### Connection Issues

If you get database connection errors:
- Verify MySQL is running: `mysql -u root -p`
- Check your `.env` credentials
- Ensure your database exists
- Verify network connectivity

### API Key Issues

- Ensure your Gemini API key is valid
- Check that API is enabled in Google Cloud Console
- Try regenerating the API key

### Query Errors

- Check that table names in your database are correct
- Verify column names match your schema
- Some queries may need refinement for complex cases

## Best Practices

1. **Ask specific questions** - More specific questions generate better SQL
2. **Use proper column names** - Reference exact column names from your schema
3. **Specify aggregations clearly** - Mention "average", "count", "sum" explicitly
4. **Disable general log** - Turn off logging when not debugging (performance impact)

## Security Considerations

- Keep your `.env` file private
- Use strong database passwords
- Restrict database user permissions
- Never commit `.env` to version control
- Use read-only database users when possible

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

