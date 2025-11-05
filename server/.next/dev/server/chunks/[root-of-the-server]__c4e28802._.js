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
"[project]/server/src/app/api/users/[id]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/src/models/User.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/src/lib/cors.js [app-route] (ecmascript)");
;
;
;
;
;
const normalizeString = (value)=>{
    if (typeof value === 'string') {
        return value.trim();
    }
    if (value === undefined || value === null) {
        return '';
    }
    return String(value).trim();
};
const readField = (entity, key)=>{
    if (!entity) {
        return '';
    }
    const value = entity[key];
    if (value === undefined || value === null) {
        return '';
    }
    if (typeof value === 'string') {
        return value.trim();
    }
    return String(value).trim();
};
const formatUser = (user)=>{
    const nested = (keys)=>{
        for (const key of keys){
            const candidate = readField(user, key);
            if (candidate) {
                return candidate;
            }
        }
        return '';
    };
    const statusRaw = readField(user, 'status');
    const status = statusRaw ? statusRaw.toLowerCase() : 'active';
    return {
        id: user._id.toString(),
        fullName: readField(user, 'name') || nested([
            'fullName',
            'firstName',
            'displayName'
        ]),
        email: readField(user, 'email'),
        mobileNumber: readField(user, 'mobile') || nested([
            'phone',
            'phoneNumber',
            'contactNumber'
        ]),
        address: nested([
            'address',
            'streetAddress',
            'addressLine',
            'location'
        ]),
        city: readField(user, 'city') || nested([
            'town',
            'locality'
        ]),
        state: readField(user, 'state') || nested([
            'province',
            'region'
        ]),
        postalCode: readField(user, 'postalCode') || nested([
            'zip',
            'zipCode',
            'pincode'
        ]),
        country: readField(user, 'country'),
        profileImage: readField(user, 'profileImage') || nested([
            'avatar',
            'photoUrl',
            'picture'
        ]),
        createdAt: user.createdAt || null,
        blockedAt: user.blockedAt || null,
        status
    };
};
const formatOrder = (order)=>{
    const amountCandidate = order?.amountPaid ?? order?.totalAmount ?? order?.amount ?? null;
    const numericAmount = typeof amountCandidate === 'number' ? amountCandidate : Number(amountCandidate);
    const amountPaid = Number.isNaN(numericAmount) ? null : numericAmount;
    const vendorName = order?.vendorName || order?.vendor?.name || order?.vendor?.businessName || '';
    const serviceType = order?.serviceType || order?.service || order?.category || '';
    const orderId = order?.orderId || order?.referenceId || (order?._id ? String(order._id) : '');
    const rawDate = order?.dateOfService || order?.serviceDate || order?.eventDate || order?.createdAt || null;
    let dateOfService = null;
    if (rawDate) {
        const parsed = new Date(rawDate);
        dateOfService = Number.isNaN(parsed.getTime()) ? rawDate : parsed.toISOString();
    }
    return {
        id: order?._id?.toString() || orderId,
        orderId: normalizeString(orderId),
        serviceType: normalizeString(serviceType),
        vendorName: normalizeString(vendorName),
        amountPaid,
        currency: normalizeString(order?.currency) || 'INR',
        dateOfService
    };
};
const fetchOrdersForUser = async (userId)=>{
    try {
        const collection = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.collection('orders');
        const userIdString = userId.toString();
        const orderDocs = await collection.find({
            $or: [
                {
                    userId
                },
                {
                    user: userId
                },
                {
                    userId: userIdString
                },
                {
                    user: userIdString
                }
            ]
        }).sort({
            dateOfService: -1,
            serviceDate: -1,
            createdAt: -1
        }).limit(50).toArray();
        return orderDocs.map(formatOrder);
    } catch (error) {
        if (error.code === 26) {
            return [];
        }
        console.error('Failed to load orders for user', error);
        return [];
    }
};
const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCORS"])(async (_request, { params })=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = params;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'User id is required'
            }, {
                status: 400
            });
        }
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id).lean();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'User not found'
            }, {
                status: 404
            });
        }
        const orders = await fetchOrdersForUser(user._id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                user: formatUser(user),
                orders
            }
        }, {
            status: 200
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to load user'
        }, {
            status: 500
        });
    }
});
const PUT = (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCORS"])(async (request, { params })=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = params;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'User id is required'
            }, {
                status: 400
            });
        }
        const payload = await request.json();
        const update = {};
        const now = new Date();
        if (payload.status !== undefined) {
            const statusValue = normalizeString(payload.status).toLowerCase();
            if (!statusValue) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    message: 'Status value is invalid'
                }, {
                    status: 400
                });
            }
            update.status = statusValue;
            if (statusValue === 'blocked') {
                update.blockedAt = now;
            } else {
                update.blockedAt = null;
            }
        }
        if (payload.address !== undefined) {
            update.address = normalizeString(payload.address);
        }
        if (payload.mobileNumber !== undefined) {
            update.mobile = normalizeString(payload.mobileNumber);
        }
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, update, {
            new: true
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'User not found'
            }, {
                status: 404
            });
        }
        if (update.status) {
            try {
                const blockedCollection = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.collection('blocked_users');
                if (update.status === 'blocked') {
                    await blockedCollection.updateOne({
                        userId: user._id
                    }, {
                        $set: {
                            userId: user._id,
                            name: user.name,
                            email: user.email,
                            mobile: user.mobile,
                            blockedAt: update.blockedAt || now,
                            updatedAt: now
                        }
                    }, {
                        upsert: true
                    });
                } else {
                    await blockedCollection.deleteOne({
                        userId: user._id
                    });
                }
            } catch (error) {
                console.error('Failed to sync blocked user record', error);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                user: formatUser(user.toObject())
            }
        }, {
            status: 200
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to update user'
        }, {
            status: 500
        });
    }
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c4e28802._.js.map