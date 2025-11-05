module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/server/src/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// Explicitly use the 'wedding' database
// Parse MONGODB_URI to ensure it uses 'wedding' database
const getMongoUri = ()=>{
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding';
    // If URI doesn't specify a database, add 'wedding'
    if (uri && !uri.includes('/wedding') && !uri.includes('?') && uri.includes('mongodb://')) {
        // Remove any existing database name and add 'wedding'
        const uriWithoutDb = uri.split('/').slice(0, 3).join('/');
        return `${uriWithoutDb}/wedding`;
    }
    // If URI has a database specified but it's not 'wedding', replace it
    if (uri.includes('/')) {
        const parts = uri.split('/');
        const lastPart = parts[parts.length - 1];
        // If last part is not 'wedding' and doesn't contain query params, replace it
        if (!lastPart.includes('wedding') && !lastPart.includes('?')) {
            parts[parts.length - 1] = 'wedding';
            return parts.join('/');
        }
        // If it contains query params, insert 'wedding' before the query params
        if (lastPart.includes('?')) {
            const [dbName, queryParams] = lastPart.split('?');
            if (dbName !== 'wedding') {
                parts[parts.length - 1] = `wedding?${queryParams}`;
                return parts.join('/');
            }
        }
    }
    return uri;
};
const MONGODB_URI = getMongoUri();
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function dbConnect() {
    try {
        // Return cached connection if already connected and ready
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState === 1) {
            // Verify we're connected to the correct database
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.name !== 'wedding') {
                console.warn(`⚠️ Currently connected to '${__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.name}' database, reconnecting to 'wedding' database...`);
                await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].disconnect();
                cached.conn = null;
                cached.promise = null;
            } else {
                // Verify connection is actually ready by checking readyState
                if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState === 1 && __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.db) {
                    return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"];
                }
            }
        }
        // Return existing promise if connection is in progress
        if (cached.promise) {
            const connection = await cached.promise;
            // Wait for connection to be fully ready
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState !== 1) {
                throw new Error('Connection not ready after promise resolved');
            }
            return connection;
        }
        // Create new connection promise with explicit database name
        // CRITICAL: dbName option will override any database name in the URI
        // This ensures we ALWAYS use 'wedding' database, never 'test' or any other database
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, {
            bufferCommands: true,
            dbName: 'wedding'
        }).then(async ()=>{
            // Wait for connection to be fully ready (readyState === 1)
            let retries = 0;
            while(__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState !== 1 && retries < 10){
                await new Promise((resolve)=>setTimeout(resolve, 100));
                retries++;
            }
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState !== 1) {
                throw new Error('MongoDB connection not ready after connection attempt');
            }
            const dbName = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.name;
            console.log('✅ Successfully connected to MongoDB');
            console.log('📊 Database:', dbName);
            console.log('🔌 Connection state:', __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState);
            // Verify database name - this should never fail if dbName option works correctly
            if (dbName !== 'wedding') {
                console.error(`❌ CRITICAL ERROR: Connected to wrong database '${dbName}' instead of 'wedding'`);
                console.error(`❌ Connection URI: ${MONGODB_URI}`);
                console.error(`❌ Please check your MONGODB_URI environment variable`);
                console.error(`❌ The dbName option should force 'wedding' database`);
                throw new Error(`Database connection error: Expected 'wedding' but got '${dbName}'`);
            } else {
                console.log('✅ Confirmed: Using "wedding" database (not "test")');
            }
            return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"];
        }).catch((error)=>{
            cached.promise = null;
            cached.conn = null;
            console.error('❌ MongoDB connection error:', error);
            throw error;
        });
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null;
        cached.conn = null;
        throw error;
    }
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/server/src/models/Admin.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
const AdminSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    name: {
        type: String,
        required: [
            true,
            'Please provide a name'
        ],
        trim: true
    },
    email: {
        type: String,
        required: [
            true,
            'Please provide an email'
        ],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    mobileNumber: {
        type: String,
        required: [
            true,
            'Please provide a mobile number'
        ],
        match: [
            /^[0-9]{10}$/,
            'Please provide a valid 10-digit mobile number'
        ]
    },
    password: {
        type: String,
        required: [
            true,
            'Please provide a password'
        ],
        minlength: 8,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
// Hash password before saving
AdminSchema.pre('save', async function(next) {
    // Only hash if password is new or modified
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate salt
        const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10);
        // Hash password
        this.password = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
// Method to compare password
AdminSchema.methods.matchPassword = async function(enteredPassword) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(enteredPassword, this.password);
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Admin || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Admin', AdminSchema);
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[project]/server/src/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateToken",
    ()=>generateToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
function generateToken(userId, email) {
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        userId,
        email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
    return token;
}
function verifyToken(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}
}),
"[project]/server/src/app/api/auth/signup/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OPTIONS",
    ()=>OPTIONS,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/src/models/Admin.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/src/lib/auth.js [app-route] (ecmascript)");
;
;
;
;
// Enable CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
async function OPTIONS() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({}, {
        headers: corsHeaders
    });
}
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { name, email, mobileNumber, password, confirmPassword } = await request.json();
        // Validation
        if (!name || !email || !mobileNumber || !password || !confirmPassword) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Please provide all required fields'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        if (password !== confirmPassword) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Passwords do not match'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        if (password.length < 8) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Password must be at least 8 characters'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Please provide a valid 10-digit mobile number'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        // Check if user already exists
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            email: email.toLowerCase()
        });
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'User with this email already exists'
            }, {
                status: 409,
                headers: corsHeaders
            });
        }
        // Create new user
        const admin = new __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            name,
            email: email.toLowerCase(),
            mobileNumber,
            password
        });
        await admin.save();
        // Generate JWT token
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])(admin._id.toString(), admin.email);
        // Return success response
        return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                mobileNumber: admin.mobileNumber
            }
        }, {
            status: 201,
            headers: corsHeaders
        });
    } catch (error) {
        console.error('Signup error:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err)=>err.message);
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: messages[0]
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        // Handle duplicate key error
        if (error.code === 11000) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Email already exists'
            }, {
                status: 409,
                headers: corsHeaders
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Internal server error'
        }, {
            status: 500,
            headers: corsHeaders
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__339db461._.js.map