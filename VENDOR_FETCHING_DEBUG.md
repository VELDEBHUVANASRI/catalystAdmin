# Vendor Fetching Debug Guide

## 🔍 Debugging Steps

If vendors are not displaying, follow these steps:

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for:
- ✅ API request URLs
- ✅ Response status codes
- ✅ Data received from API
- ✅ Any error messages

### 2. Check Network Tab
1. Open DevTools → Network tab
2. Refresh the page
3. Look for requests to `/api/vendors/*`
4. Click on the request to see:
   - Request URL
   - Response status
   - Response body

### 3. Verify Database Connection
The API routes now log:
- Total vendors in database
- Vendors by status breakdown
- Sample vendor data

Check server console/logs for these messages.

### 4. Verify Vendor Status Values
Vendors must have exactly these status values:
- `'pending'` (not `'Pending'`, `'PENDING'`, etc.)
- `'accepted'`
- `'rejected'`

### 5. Test API Endpoints Directly

Open these URLs in your browser (while server is running):
- `http://localhost:3000/api/vendors` - All vendors
- `http://localhost:3000/api/vendors/pending` - Pending vendors
- `http://localhost:3000/api/vendors/accepted` - Accepted vendors
- `http://localhost:3000/api/vendors/rejected` - Rejected vendors

You should see JSON responses with vendor data.

### 6. Common Issues & Solutions

#### Issue: "No vendors to display" but vendors exist in DB
**Solution**: Check vendor status values match exactly: `'pending'`, `'accepted'`, `'rejected'`

#### Issue: CORS errors
**Solution**: Ensure server is running and CORS is configured correctly

#### Issue: API returns empty array
**Solution**: 
1. Check database connection
2. Verify vendors exist
3. Check status field values
4. See server console logs for status breakdown

#### Issue: Network errors
**Solution**:
1. Verify API_BASE_URL is correct
2. Ensure server is running on port 3000
3. Check for firewall/network issues

### 7. Enhanced Logging
The updated code now includes:
- ✅ Detailed console logging with emojis for easy identification
- ✅ Status breakdown in API responses
- ✅ Better error messages
- ✅ Debug information in UI

### 8. MongoDB Query to Check Vendors

Run this in MongoDB shell or Compass:
```javascript
// Connect to wedding database
use wedding

// Count all vendors
db.vendors.countDocuments({})

// Count by status
db.vendors.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
])

// View all vendors
db.vendors.find({}).pretty()

// View pending vendors
db.vendors.find({ status: "pending" }).pretty()
```

### 9. Fix Status Values

If vendors have incorrect status values, update them:
```javascript
// Fix common status variations
db.vendors.updateMany(
  { status: { $in: ["Pending", "PENDING", "pending "] } },
  { $set: { status: "pending" } }
)

db.vendors.updateMany(
  { status: { $in: ["Accepted", "ACCEPTED"] } },
  { $set: { status: "accepted" } }
)

db.vendors.updateMany(
  { status: { $in: ["Rejected", "REJECTED"] } },
  { $set: { status: "rejected" } }
)
```

### 10. Expected Behavior

When working correctly:
1. Page loads → Shows "Loading..."
2. API call completes → Vendors appear in table
3. Each tab shows correct count
4. Console shows detailed logs
5. No errors in console or network tab

If issues persist, check the enhanced error messages in the UI and console logs.

