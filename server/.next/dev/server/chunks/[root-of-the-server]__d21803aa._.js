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
"[project]/Downloads/wedding/wedding/server/src/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// Default to the `wedding` database so vendor documents are stored
// in the `vendors` collection of that database unless overridden by env.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function dbConnect() {
    try {
        // Return cached connection if already connected
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState === 1) {
            return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"];
        }
        // Return existing promise if connection is in progress
        if (cached.promise) {
            return await cached.promise;
        }
        // Create new connection promise
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, {
            bufferCommands: false
        }).then(()=>{
            console.log('✅ Successfully connected to MongoDB');
            console.log('📊 Database:', __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.name);
            return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"];
        }).catch((error)=>{
            cached.promise = null;
            console.error('❌ MongoDB connection error:', error);
            throw error;
        });
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null;
        throw error;
    }
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/Downloads/wedding/wedding/server/src/models/Admin.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
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
        const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10);
        // Hash password
        this.password = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
// Method to compare password
AdminSchema.methods.matchPassword = async function(enteredPassword) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(enteredPassword, this.password);
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
"[project]/Downloads/wedding/wedding/server/src/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateToken",
    ()=>generateToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
function generateToken(userId, email) {
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        userId,
        email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
    return token;
}
function verifyToken(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}
}),
"[project]/Downloads/wedding/wedding/server/src/app/api/auth/signup/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OPTIONS",
    ()=>OPTIONS,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Admin.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/auth.js [app-route] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({}, {
        headers: corsHeaders
    });
}
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { name, email, mobileNumber, password, confirmPassword } = await request.json();
        // Validation
        if (!name || !email || !mobileNumber || !password || !confirmPassword) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Please provide all required fields'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        if (password !== confirmPassword) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Passwords do not match'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        if (password.length < 8) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Password must be at least 8 characters'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Please provide a valid 10-digit mobile number'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        // Check if user already exists
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            email: email.toLowerCase()
        });
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'User with this email already exists'
            }, {
                status: 409,
                headers: corsHeaders
            });
        }
        // Create new user
        const admin = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            name,
            email: email.toLowerCase(),
            mobileNumber,
            password
        });
        await admin.save();
        // Generate JWT token
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])(admin._id.toString(), admin.email);
        // Return success response
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: messages[0]
            }, {
                status: 400,
                headers: corsHeaders
            });
        }
        // Handle duplicate key error
        if (error.code === 11000) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Email already exists'
            }, {
                status: 409,
                headers: corsHeaders
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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

//# sourceMappingURL=%5Broot-of-the-server%5D__d21803aa._.js.map