# Quick Start Guide

## 1. Setup Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
GEMINI_API_KEY=your_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
```

## 2. Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Click "Get API Key"
3. Copy the key to your `.env` file

## 3. Install & Run

```bash
npm install
npm run dev
```

Visit http://localhost:9002

## 4. Database Setup

- Your database must already exist in MySQL
- The app will automatically detect all tables and columns
- No migrations or setup scripts needed

## 5. View Executed Queries (Optional)

In MySQL Workbench:
```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';
SELECT event_time, command_type, argument FROM mysql.general_log ORDER BY event_time DESC LIMIT 50;
SET GLOBAL general_log = 'OFF';
```

## Troubleshooting

**Connection refused?**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**API key error?**
- Verify key is correct
- Check API is enabled in Google Cloud

**No results?**
- Check your question is specific enough
- Try simpler queries first
- Verify table and column names exist
