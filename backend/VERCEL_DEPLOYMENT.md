# Vercel Deployment Guide for Mockly Backend

## Environment Variables Required

Add these environment variables in your Vercel dashboard:

```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the backend directory**:
   ```bash
   cd backend
   vercel
   ```

4. **Set up environment variables** in the Vercel dashboard:
   - Go to your project settings
   - Add all required environment variables
   - Redeploy if needed

## Key Changes Made for Vercel Compatibility

### 1. Serverless Function Structure
- Created `api/index.js` as the main entry point
- Moved from Express server to serverless function export
- Added proper database connection handling for serverless

### 2. File Storage Changes
- **Before**: Local file storage in `uploads/` directory
- **After**: Base64 encoding stored in MongoDB
- Files are now stored as base64 strings in the database
- No filesystem dependencies

### 3. PDF Processing Updates
- PDF extraction now works with base64 data
- Removed file path dependencies
- Updated validation to work with base64 strings

### 4. Database Connection Optimization
- Added connection pooling for serverless
- Improved connection reuse
- Better error handling for serverless environment

### 5. CORS Configuration
- Added proper CORS headers in vercel.json
- Configured for frontend domain compatibility
- Support for credentials and all HTTP methods

## File Structure Changes

```
backend/
├── api/
│   └── index.js          # Main serverless function entry point
├── config/
│   ├── db.js            # Optimized MongoDB connection
│   └── fileUpload.js    # Base64 file handling
├── models/              # MongoDB models (updated for base64)
├── routes/              # API routes (updated for serverless)
├── services/            # Business logic (PDF processing updated)
├── vercel.json          # Vercel configuration
└── package.json         # Updated scripts
```

## Testing the Deployment

1. **Health Check**: `GET https://your-domain.vercel.app/health`
2. **API Test**: `GET https://your-domain.vercel.app/api/users/current-user`
3. **File Upload Test**: Upload a resume through your frontend

## Important Notes

- **File Size Limits**: Base64 encoding increases file size by ~33%. Keep uploads under 5MB.
- **Function Timeout**: Vercel functions have a 30-second timeout (configured in vercel.json).
- **Cold Starts**: First request may be slower due to database connection initialization.
- **Memory Limits**: Vercel Pro plan recommended for production use.

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Check MONGO_URI environment variable
   - Ensure MongoDB Atlas allows connections from 0.0.0.0/0
   - Verify network access settings

2. **File Upload Issues**:
   - Check if files are properly converted to base64
   - Verify file size limits
   - Test PDF processing with sample files

3. **CORS Errors**:
   - Update frontend API base URL to your Vercel domain
   - Check CORS headers in vercel.json
   - Verify origin settings

4. **Function Timeouts**:
   - Large PDF processing may timeout
   - Consider implementing async processing for large files
   - Monitor function execution times

### Frontend Updates Required:

Update your frontend API base URL to point to your Vercel deployment:
```javascript
// In your frontend config
const API_BASE_URL = 'https://your-backend-domain.vercel.app';
```

## Performance Optimization

- Database connections are reused across function invocations
- PDF processing includes fallback mechanisms
- Error handling prevents function crashes
- Optimized for serverless cold start performance