# Vendor Management Module - Features & Usage Guide

## 🎯 Quick Navigation

### How to Access Vendor Features

1. **From Dashboard:**
   - Click on Sidebar → Vendor menu
   - Select one of the following:
     - **Vendor Request** - View and manage vendor requests
     - **Create Vendor** - Register a new vendor
     - **Vendor Details** - View vendor information (when clicked from request list)

---

## 📋 Vendor Request Page

**URL:** `/vendor/request`

### What You Can Do:

#### 1️⃣ **View All Vendor Requests**
- Table displays all pending vendor requests
- Shows 5 sample vendors with full information
- Smooth animations and hover effects

#### 2️⃣ **Search & Filter**
```
Business Name Field  → Filter by vendor's business name
Category Field       → Filter by service category
Search Button        → Apply filters
Reset Button         → Clear all filters
```

**Example:**
- Search for "Blue" in Business Name to find "BlueMoon Events"
- Search for "Photography" in Category to find "Perfect Photography"

#### 3️⃣ **View Vendor Details**
- Click "View Details" button in the table
- Opens vendor details page with:
  - Full vendor information
  - Status timeline
  - Uploaded documents
  - Download options

#### 4️⃣ **Approve Vendor Request**
- Click ✅ (green checkmark) in Action column
- Confirmation modal appears
- Click "Confirm" to approve
- Success toast shows: "Vendor request approved successfully!"
- Vendor removed from list

#### 5️⃣ **Reject Vendor Request**
- Click ❌ (red X) in Action column
- Rejection modal appears with:
  - Required reason textbox
  - Three action buttons:
    - **Cancel** - Close modal
    - **Request Modification** - Ask vendor to resubmit
    - **Confirm Rejection** - Reject permanently
- Toast notification confirms action
- Vendor removed from list

#### 6️⃣ **Create New Vendor**
- Click "+ Create Vendor" button (top-right)
- Navigates to vendor registration form
- See below for registration details

---

## 📝 Vendor Create/Registration Page

**URL:** `/vendor/create`

### Form Fields & Instructions:

#### 📌 **Section 1: Business Information**

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Business Name | Text | ✅ Yes | Name of vendor business (e.g., "BlueMoon Events") |
| Person Name | Text | ✅ Yes | Vendor contact person's name |
| Category | Dropdown | ✅ Yes | Select from: Catering, Photography, etc. |
| City | Text | ✅ Yes | Vendor's location (e.g., "Chennai") |

#### 📌 **Section 2: Contact Information**

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Email | Email | ✅ Yes | Business email (with Verify button) |
| Email OTP | Text | ✅ Yes* | Appears after clicking Verify |
| Phone Number | Tel | ✅ Yes | Contact number (with Verify button) |
| Mobile OTP | Text | ✅ Yes* | Appears after clicking Verify |

**Verification Process:**
1. Enter email → Click "Verify" → Badge shows "✓ Verified"
2. Enter phone → Click "Verify" → Badge shows "✓ Verified"
3. Both verifications are required to proceed

#### 📌 **Section 3: Security**

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Password | Password | ✅ Yes | Create strong password |
| Confirm Password | Password | ✅ Yes | Must match password field |

**Validation:** Passwords must be identical or error shows

#### 📌 **Section 4: Documents**

| Field | Type | Required | Details |
|-------|------|----------|---------|
| PAN Card | File | ✅ Yes | Upload PDF, JPG, or PNG |
| Registration Doc | File | ✅ Yes | Upload PDF, JPG, or PNG |
| GST Certificate | File | ✅ Yes | Upload PDF, JPG, or PNG |

**File Upload:**
- Click on file input
- Select file from computer
- File name shows below input when selected
- Max file size: (depends on server configuration)

### 📊 Form Validation

Red asterisk (*) indicates required fields.

**Error Messages Appear When:**
- Required field is empty
- Email format is invalid
- Passwords don't match
- File not uploaded
- Email/Phone not verified

**Fix:** Fill all required fields → Re-check validation → Submit

### ✅ Creating an Account

1. Fill all required fields (marked with *)
2. Verify email and phone
3. Upload all three documents
4. Click "Create Account" button
5. Success modal appears: "Vendor Account Created Successfully!"
6. Click "Close" to finish
7. Form resets automatically
8. Toast notification: "Vendor account created successfully!"

---

## 👁️ Vendor Request Details Page

**URL:** `/vendor/request-details` (accessed from Vendor Request list)

### Page Sections:

#### 1️⃣ **Header**
- "← Back to Vendor Request" button (top-left)
- Page title: "Vendor Request Details"
- Click back button to return to vendor list

#### 2️⃣ **Vendor Information Card**
Shows all vendor details:
```
Profile Picture (Emoji Avatar)
├─ Business Name
├─ Category (badge)
├─ Person Name
├─ Email (clickable)
├─ Phone (clickable)
└─ City
```

**Interactive Elements:**
- Click email → Opens mail client
- Click phone → Opens phone dialer (on mobile)

#### 3️⃣ **Request Status Card**
Shows approval workflow:
```
Status Badge: "Pending Review" (with pulsing animation)
└─ Timeline:
   ├─ ✓ Submitted (Oct 31, 2024)
   ├─ 🔵 Under Review (In Progress)
   └─ ⭕ Approval/Rejection (Pending)
```

**Status Indicators:**
- Green checkmark (✓) = Completed
- Blue dot (🔵) = Currently processing
- Light gray (⭕) = Not yet reached

#### 4️⃣ **Documents Section**
Three document cards showing:
- Document name
- Document type (PDF/Image)
- Description
- View button → Opens document in new tab
- Download button → Downloads to computer

**Available Documents:**
1. PAN Card Document
2. Registration/Ownership Document
3. GST/VAT Certificate

---

## 🎨 UI/UX Features

### Buttons & Colors

| Element | Color | Behavior |
|---------|-------|----------|
| Primary Actions | Light Blue (#4da6ff) | Hover lifts up, shadow increases |
| Success Actions | Green (#10b981) | Used for approve buttons |
| Danger Actions | Red (#ef4444) | Used for reject/delete |
| Secondary Actions | Orange (#fb923c) | Used for modify requests |
| Neutral Actions | Gray (#e0e0e0) | Used for cancel/reset |

### Interactive Feedback

- **Hover Effects:** Buttons lift up slightly, colors darken
- **Click Effects:** Button presses down momentarily
- **Animations:** Smooth 0.3s transitions
- **Toasts:** Slide in from bottom-right, auto-dismiss in 3s
- **Modals:** Fade in with slide-up animation

### Responsive Design

#### Desktop (1024px+)
- Full table with all columns visible
- Two-column form layout
- Side-by-side charts and cards

#### Tablet (768px - 1024px)
- Table shows 3 main columns
- Single column form layout
- Stacked cards

#### Mobile (< 768px)
- Only essential table columns
- Full-width buttons
- Single column everything
- Touch-friendly spacing

---

## 🔄 Data Flow

### Vendor Request Flow
```
View List
    ↓
[Filter] → View Details or Approve/Reject
    ↓
If Approve:
    → Show Modal → Confirm → Success Toast → Remove from List
    
If Reject:
    → Show Modal → Enter Reason → Confirm/Modify → Toast → Remove from List
    
If View Details:
    → Show Details Page → View Documents → Download/View
    → Back Button → Return to List
```

### Vendor Creation Flow
```
Click "Create Vendor"
    ↓
Fill Business Info → Fill Contact Info → Verify Email → Verify Phone
    ↓
Fill Security Info → Upload Documents
    ↓
Click "Create Account"
    ↓
Validation → If Error (Show Messages) → If OK (Show Success Modal)
    ↓
Close Modal → Form Resets → Toast Shows Success
```

---

## 🎓 Common Tasks

### Task 1: Approve a Vendor
1. Go to `/vendor/request`
2. Find vendor in table
3. Click ✅ button
4. Click "Confirm" in modal
5. See "Approved successfully!" toast
6. Vendor disappears from list ✓

### Task 2: Reject a Vendor
1. Go to `/vendor/request`
2. Find vendor in table
3. Click ❌ button
4. Type rejection reason (required)
5. Click "Confirm Rejection" (red button)
6. See confirmation toast
7. Vendor disappears from list ✓

### Task 3: View Vendor Details
1. Go to `/vendor/request`
2. Click "View Details" button
3. See all vendor information
4. See status timeline
5. Click "View" or "Download" for documents
6. Click "← Back to Vendor Request" to return ✓

### Task 4: Create New Vendor
1. Click "Create Vendor" button
2. Fill "Business Name" → "Person Name" → Select "Category" → Enter "City"
3. Enter "Email" → Click "Verify" → Confirm OTP appears
4. Enter "Phone" → Click "Verify" → Confirm OTP appears
5. Enter "Password" and "Confirm Password"
6. Upload 3 documents (PAN, Registration, GST)
7. Click "Create Account"
8. See success modal
9. See "Account created successfully!" toast ✓

### Task 5: Search Vendors
1. Go to `/vendor/request`
2. Type in "Business Name" field (e.g., "Blue")
3. Type in "Category" field (e.g., "Catering")
4. Click "Search" button
5. Table filters to matching vendors
6. Click "Reset" to clear filters ✓

---

## 🛠️ Troubleshooting

### "Form validation failed" - Creating Vendor
**Solution:**
- Check all fields with red asterisk (*) are filled
- Email must be verified (click Verify button)
- Phone must be verified (click Verify button)
- Passwords must match exactly
- All 3 documents must be uploaded

### "Modal not closing" - Approve/Reject
**Solution:**
- For rejection, make sure reason is entered in textbox
- Click the correct action button
- If still stuck, click modal close button (X)

### "Vendor not disappearing from list" - After approval
**Solution:**
- This is the expected behavior in this demo
- In production with backend, vendor would be removed after server confirmation

### "Document won't download"
**Solution:**
- This is a demo - download button triggers browser behavior
- In production, real documents would download
- View button opens in new tab (also demo behavior)

---

## 📊 Sample Data

### Pre-loaded Vendors
1. **BlueMoon Events**
   - Category: Catering
   - Contact: Rahul Mehta
   - Email: rahul@bluemoon.com
   - Phone: +91 9876543210
   - City: Chennai

2. **Perfect Photography**
   - Category: Photography
   - Contact: Unknown
   - Email: info@perfectphoto.com
   - Phone: +91 9123456789

3. **Elegant Decor**
   - Category: Decoration
   - Contact: Unknown
   - Email: decor@elegant.com
   - Phone: +91 8765432109
   - City: Unknown

4. **Sound Wave Entertainment**
   - Category: Entertainment
   - Email: sound@waveent.com
   - Phone: +91 7654321098

5. **Fresh Flowers Studio**
   - Category: Flowers
   - Email: flowers@freshstudio.com
   - Phone: +91 6543210987

### Category Options
- Catering
- Photography
- Decoration
- Entertainment
- Flowers
- Venue
- Cake & Bakery
- Music & DJ
- Transport
- Other

---

## 💡 Tips & Tricks

1. **Multiple Filters:** Combine business name + category for precise search
2. **Quick Approve:** Use the action icons (not text buttons) for faster approval
3. **Document Management:** All documents are shown on details page
4. **Modal Escape:** Press Escape key to close modals (in some browsers)
5. **Mobile Friendly:** All features work perfectly on phones/tablets

---

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

---

## 🔐 Security Notes

- All form inputs are validated
- Email verification required
- Phone verification required
- Passwords must match
- Protected routes require login
- No sensitive data is stored locally

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the specific page documentation
3. Check browser console for error messages
4. Ensure all required fields are filled

---

## ✨ Next Steps

After setting up vendors:
- Manage vendor payments in Finance section
- Send messages via Messaging section
- View analytics in Analytics section
- Create events using approved vendors