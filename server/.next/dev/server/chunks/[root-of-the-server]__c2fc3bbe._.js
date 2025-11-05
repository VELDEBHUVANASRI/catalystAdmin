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
"[project]/Downloads/wedding/wedding/server/src/models/User.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        unique: true,
        index: true
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
        enum: [
            'vendor'
        ],
        default: 'vendor',
        trim: true
    },
    // Document fields
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
            'approved',
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
"[project]/Downloads/wedding/wedding/server/src/models/Service.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const ServiceSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    vendorId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        default: 0
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
    },
    images: [
        {
            type: String
        }
    ],
    documents: [
        {
            name: String,
            url: String
        }
    ]
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Service || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Service', ServiceSchema);
}),
"[project]/Downloads/wedding/wedding/server/src/models/Event.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const EventSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'User'
    },
    vendorId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    serviceId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Service'
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            'wedding',
            'birthday',
            'corporate',
            'concert',
            'other'
        ],
        trim: true
    },
    eventName: {
        type: String,
        trim: true
    },
    eventDate: {
        type: Date
    },
    status: {
        type: String,
        enum: [
            'upcoming',
            'completed',
            'cancelled'
        ],
        default: 'upcoming',
        trim: true
    },
    amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Event || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Event', EventSchema);
}),
"[project]/Downloads/wedding/wedding/server/src/models/Subscription.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const SubscriptionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    vendorId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    planType: {
        type: String,
        enum: [
            'standard',
            'premium',
            'enterprise'
        ],
        default: 'standard',
        trim: true
    },
    subscriptionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: [
            'active',
            'expired',
            'cancelled'
        ],
        default: 'active',
        trim: true
    },
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'paid',
            'failed'
        ],
        default: 'pending',
        trim: true
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Subscription || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Subscription', SubscriptionSchema);
}),
"[project]/Downloads/wedding/wedding/server/src/models/Ticket.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const TicketSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    ticketId: {
        type: String,
        unique: true,
        trim: true
    },
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'User'
    },
    vendorId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: [
            'low',
            'medium',
            'high'
        ],
        default: 'low',
        trim: true
    },
    status: {
        type: String,
        enum: [
            'open',
            'pending',
            'in-progress',
            'resolved',
            'closed'
        ],
        default: 'open',
        trim: true
    },
    attachment: {
        name: {
            type: String,
            trim: true
        },
        url: {
            type: String,
            trim: true
        },
        data: {
            type: String
        }
    },
    assignedTo: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Admin'
    },
    resolution: {
        type: String,
        trim: true
    }
}, {
    collection: 'tickets',
    timestamps: true
});
// Generate ticket ID before saving
TicketSchema.pre('save', async function(next) {
    if (!this.ticketId) {
        const count = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Ticket').countDocuments();
        this.ticketId = `TKT-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Ticket || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Ticket', TicketSchema);
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
"[project]/Downloads/wedding/wedding/server/src/app/api/analytics/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/User.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Vendor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Vendor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Service$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Service.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Event$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Event.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Subscription.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Ticket$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Ticket.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/cors.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCORS"])(async (request)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Get user stats
        const totalUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments();
        const activeUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            status: 'active'
        });
        const blockedUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            status: 'blocked'
        });
        // Get vendor stats
        const totalVendors = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Vendor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments();
        const activeVendors = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Vendor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            status: 'approved'
        });
        const blockedVendors = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Vendor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            status: 'rejected'
        });
        // Get service stats
        const totalServices = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Service$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments();
        const acceptedServices = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Service$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            status: 'accepted'
        });
        // Get event stats
        const totalEvents = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Event$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments();
        const eventTypeAggregation = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Event$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $group: {
                    _id: '$eventType',
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);
        const eventTypeData = eventTypeAggregation.map((item)=>({
                label: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1).toLowerCase() : 'Other',
                value: item.count
            }));
        // Get monthly user registration data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const userRegistrations = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: sixMonthsAgo
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: '$createdAt'
                        },
                        month: {
                            $month: '$createdAt'
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);
        const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        const userOverviewData = userRegistrations.map((item)=>({
                month: monthNames[item._id.month - 1],
                users: item.count
            }));
        // Get monthly vendor registration data
        const vendorRegistrations = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Vendor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: sixMonthsAgo
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: '$createdAt'
                        },
                        month: {
                            $month: '$createdAt'
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);
        const vendorRegistrationData = vendorRegistrations.map((item)=>({
                month: monthNames[item._id.month - 1],
                vendors: item.count
            }));
        // Calculate average events per vendor
        const avgEventsPerVendor = totalVendors > 0 ? (totalEvents / totalVendors).toFixed(1) : 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                userStats: {
                    totalUsers,
                    activeUsers,
                    blockedUsers
                },
                vendorStats: {
                    totalVendors,
                    activeVendors,
                    blockedVendors
                },
                serviceStats: {
                    totalServices,
                    acceptedServices
                },
                eventStats: {
                    totalEvents,
                    avgEventsPerVendor: parseFloat(avgEventsPerVendor),
                    eventTypeData
                },
                userOverviewData,
                vendorRegistrationData
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message
        }, {
            status: 500
        });
    }
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c2fc3bbe._.js.map