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
"[project]/server/src/models/User.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    name: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    mobile: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        trim: true,
        lowercase: true,
        default: 'active'
    },
    password: {
        type: String,
        trim: true,
        default: '',
        select: false
    }
}, {
    collection: 'users',
    timestamps: true,
    strict: false
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('User', UserSchema);
}),
"[project]/server/src/lib/cors.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "corsHeaders",
    ()=>corsHeaders,
    "withCORS",
    ()=>withCORS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/node_modules/next/server.js [app-route] (ecmascript)");
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
            return new __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 200,
                headers: corsHeaders
            });
        }
        try {
            // Execute the handler
            const response = await handler(request, context);
            // Ensure we have a NextResponse object
            const nextResponse = response instanceof __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"] ? response : __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
            // Add CORS headers to the response
            Object.entries(corsHeaders).forEach(([key, value])=>{
                nextResponse.headers.set(key, value);
            });
            return nextResponse;
        } catch (error) {
            // Handle errors with CORS headers
            const errorResponse = __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
"[project]/server/src/app/api/users/route.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/server/src/app/api/users/route.js'\n\nExpression expected");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8bff5a80._.js.map