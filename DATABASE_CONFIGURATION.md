# Database Configuration - Wedding Database Only

## ✅ Configuration Updated

The application is now **explicitly configured** to use **ONLY** the `wedding` database, never `test` or any other database.

## 🔧 Changes Made

### Database Connection (`server/src/lib/db.js`)

1. **Explicit Database Name**: Added `dbName: 'wedding'` option in `mongoose.connect()`
   - This **overrides** any database name specified in the MongoDB URI
   - Ensures we **always** connect to `wedding` database

2. **URI Parsing**: Automatically ensures URI includes `wedding` database name
   - Parses `MONGODB_URI` to replace any database name with `wedding`
   - Handles URIs with query parameters correctly

3. **Database Verification**: Checks on connection
   - Verifies connected database is `wedding`
   - Logs error if connected to wrong database
   - Reconnects if connected to wrong database

4. **Connection Caching**: Includes database name check
   - If cached connection is to wrong database, reconnects
   - Ensures consistency across requests

## 📋 How It Works

### Default Behavior
```javascript
// Default URI if MONGODB_URI not set
mongodb://localhost:27017/wedding
```

### URI Override
Even if you set:
```javascript
MONGODB_URI=mongodb://localhost:27017/test
```

The application will:
1. Parse URI and replace `test` with `wedding`
2. Use `dbName: 'wedding'` option which **overrides** URI database name
3. **Always** connect to `wedding` database

### MongoDB Atlas / Cloud URIs
```javascript
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/somedb
```

Will be forced to use `wedding` database via `dbName` option.

## ✅ Verification

When the server starts, you'll see:
```
✅ Successfully connected to MongoDB
📊 Database: wedding
✅ Confirmed: Using "wedding" database (not "test")
```

If you see a different database name, the connection will fail with an error.

## 🔍 Debugging

To verify which database you're connected to:

1. Check server console logs on startup
2. Visit `/api/debug` endpoint (if available)
3. Check MongoDB connection logs

## 📝 Environment Variables

The `MONGODB_URI` environment variable can be set, but the database name will always be forced to `wedding`:

```bash
# These will all use 'wedding' database:
MONGODB_URI=mongodb://localhost:27017/wedding      # ✅ Explicit
MONGODB_URI=mongodb://localhost:27017/test         # ✅ Overridden to 'wedding'
MONGODB_URI=mongodb://localhost:27017              # ✅ Adds '/wedding'
```

## 🎯 Result

The application **will NEVER** use the `test` database. It will **ALWAYS** use the `wedding` database, regardless of:
- MongoDB URI configuration
- Default MongoDB behavior
- Environment variables

The `dbName` option in mongoose.connect() ensures this.

