# Vendor Database Schema & Fetching Guide

## 📊 Database Configuration

- **Database Name**: `wedding`
- **Collection**: `vendors`
- **Connection**: `mongodb://localhost:27017/wedding` (configurable via `MONGODB_URI`)

---

## 📋 Vendor Schema Fields

All vendor data is fetched from MongoDB using these exact field names:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `businessName` | String | ✅ Yes | Business/Company name |
| `contactName` | String | ✅ Yes | Contact person's name |
| `email` | String | ✅ Yes | Email (unique, lowercase) |
| `phone` | String | ✅ Yes | Phone number |
| `category` | String | ✅ Yes | Service category |
| `city` | String | ✅ Yes | City location |
| `passwordHash` | String | ✅ Yes | Bcrypt hashed password (excluded from API) |
| `role` | String | No | Default: `'vendor'` |
| `panCard` | String | No | PAN card document URL/path |
| `registrationDoc` | String | No | Registration document URL/path |
| `gstCertificate` | String | No | GST certificate URL/path |
| `status` | String | No | `'pending'` / `'accepted'` / `'rejected'` |
| `rejectionReason` | String | No | Reason for rejection |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

---

## 🔌 API Endpoints - Correct Field Mapping

All endpoints now use the correct schema fields:

### 1. GET /api/vendors/pending
```javascript
Vendor.find({ status: 'pending' })
  .select('-passwordHash')  // Excludes password
  .sort({ createdAt: -1 })
  .lean()
```

**Response Fields**:
- `id`, `businessName`, `contactName`, `category`, `email`, `phone`, `city`, `status`, `role`, `panCard`, `registrationDoc`, `gstCertificate`, `createdAt`, `updatedAt`

### 2. GET /api/vendors/accepted
```javascript
Vendor.find({ status: 'accepted' })
  .select('-passwordHash')
  .sort({ createdAt: -1 })
  .lean()
```

### 3. GET /api/vendors/rejected
```javascript
Vendor.find({ status: 'rejected' })
  .select('-passwordHash')
  .sort({ updatedAt: -1, createdAt: -1 })
  .lean()
```

**Response Fields**: Same as pending + `rejectionReason`

### 4. GET /api/vendors
```javascript
Vendor.find({})
  .select('-passwordHash')
  .sort({ createdAt: -1 })
  .lean()
```

**Response Fields**: All vendors regardless of status

### 5. GET /api/vendors/[id]
```javascript
Vendor.findById(id)
  .select('-passwordHash')
  .lean()
```

**Response Fields**: Complete vendor details

### 6. PUT /api/vendors/[id]
```javascript
Vendor.findByIdAndUpdate(id, update, { new: true })
```

**Updates**: `status`, `rejectionReason`

---

## ✅ All API Routes Updated

All routes now correctly use:
- ✅ `contactName` (not `personName`)
- ✅ `panCard` (not `panDocument`)
- ✅ `registrationDoc` (not `registrationDocument`)
- ✅ `gstCertificate` (not `gstDocument`)
- ✅ Excludes `passwordHash` from all responses
- ✅ Consistent field naming across all endpoints

---

## 📝 Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "businessName": "BlueMoon Events",
      "contactName": "Rahul Mehta",
      "category": "Catering",
      "email": "rahul@bluemoon.com",
      "phone": "9876543210",
      "city": "Chennai",
      "status": "pending",
      "role": "vendor",
      "panCard": "",
      "registrationDoc": "",
      "gstCertificate": "",
      "rejectionReason": "",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 🔍 Frontend Usage

The frontend (`src/pages/Vendor/VendorRequest.js`) correctly maps these fields:

```javascript
const formatVendor = (vendor) => ({
  id: vendor.id || vendor._id || '',
  businessName: vendor.businessName || '',
  contactName: vendor.contactName || '',  // ✅ Correct field
  category: vendor.category || '',
  email: vendor.email || '',
  phone: vendor.phone || '',
  city: vendor.city || '',
  status: (vendor.status || '').toLowerCase(),
  role: vendor.role || 'vendor',
  panCard: vendor.panCard || '',           // ✅ Correct field
  registrationDoc: vendor.registrationDoc || '',  // ✅ Correct field
  gstCertificate: vendor.gstCertificate || '',    // ✅ Correct field
  createdAt: vendor.createdAt,
  updatedAt: vendor.updatedAt
});
```

---

## ✨ Key Points

1. **Database**: `wedding` database
2. **Collection**: `vendors` collection
3. **Field Names**: All API routes use exact schema field names
4. **Security**: `passwordHash` excluded from all responses
5. **Status Filtering**: Queries filter by `status` field
6. **Consistency**: All endpoints return the same field structure

All vendor fetching now uses the correct database schema fields!

