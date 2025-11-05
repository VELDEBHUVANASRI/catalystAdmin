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
"[project]/Downloads/wedding/wedding/server/src/models/Vendor.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
const VendorSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    contactName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'vendor',
        trim: true
    },
    panCard: {
        type: String
    },
    registrationDoc: {
        type: String
    },
    gstCertificate: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'pending',
            'accepted',
            'rejected'
        ],
        default: 'pending',
        trim: true
    },
    rejectionReason: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});
VendorSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }
    try {
        const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10);
        this.passwordHash = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(this.passwordHash, salt);
        next();
    } catch (error) {
        next(error);
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Vendor || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Vendor', VendorSchema);
}),
"[project]/Downloads/wedding/wedding/server/src/lib/cors.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "corsHeaders",
    ()=>corsHeaders,
    "withCORS",
    ()=>withCORS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/next/server.js [app-route] (ecmascript)");
;
// CORS headers configuration
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
};
function withCORS(handler) {
    return async (request, context)=>{
        // Handle preflight OPTIONS requests
        if (request.method === 'OPTIONS') {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 200,
                headers: corsHeaders
            });
        }
        try {
            // Execute the handler
            const response = await handler(request, context);
            // Ensure we have a NextResponse object
            const nextResponse = response instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"] ? response : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
            // Add CORS headers to the response
            Object.entries(corsHeaders).forEach(([key, value])=>{
                nextResponse.headers.set(key, value);
            });
            return nextResponse;
        } catch (error) {
            // Handle errors with CORS headers
            const errorResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: error.message || 'Internal server error'
            }, {
                status: 500
            });
            Object.entries(corsHeaders).forEach(([key, value])=>{
                errorResponse.headers.set(key, value);
            });
            return errorResponse;
        }
    };
}
;
}),
"[project]/Downloads/wedding/wedding/server/src/app/api/vendors/accepted/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Vendor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Vendor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/cors.js [app-route] (ecmascript)");
;
;
;
;
const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCORS"])(async ()=>{
    try {
        console.log('🔌 Connecting to database...');
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        console.log('✅ Connected to database, fetching accepted vendors...');
        const vendors = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Vendor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            status: 'accepted'
        }).select('-passwordHash').sort({
            createdAt: -1
        }).lean();
        console.log('✅ Found accepted vendors:', vendors.length);
        if (vendors.length === 0) {
            console.log('⚠️ No accepted vendors found');
        }
        const data = vendors.map((vendor)=>({
                id: vendor._id.toString(),
                businessName: vendor.businessName || '',
                contactName: vendor.contactName || '',
                category: vendor.category || '',
                email: vendor.email || '',
                phone: vendor.phone || '',
                city: vendor.city || '',
                status: vendor.status || 'accepted',
                role: vendor.role || 'vendor',
                panCard: vendor.panCard || '',
                registrationDoc: vendor.registrationDoc || '',
                gstCertificate: vendor.gstCertificate || '',
                createdAt: vendor.createdAt,
                updatedAt: vendor.updatedAt
            }));
        console.log('📦 Returning', data.length, 'accepted vendors');
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data
        }, {
            status: 200
        });
    } catch (error) {
        console.error('❌ Error in accepted vendors route:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to load accepted vendors',
            error: error.message
        }, {
            status: 500
        });
    }
});
const OPTIONS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCORS"])(async ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({}, {
        status: 200
    });
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a3924437._.js.map