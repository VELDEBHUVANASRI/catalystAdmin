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
"[project]/Downloads/wedding/wedding/server/src/app/api/tickets/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Ticket$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/models/Ticket.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/wedding/wedding/server/src/lib/cors.js [app-route] (ecmascript)");
;
;
;
;
const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCORS"])(async (request)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const search = searchParams.get('search');
        const filters = {};
        if (status && status !== 'all') {
            filters.status = status.toLowerCase();
        }
        if (priority) {
            filters.priority = priority.toLowerCase();
        }
        if (search) {
            filters.$or = [
                {
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    ticketId: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }
        const tickets = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Ticket$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(filters).populate('vendorId', 'businessName').populate('userId', 'name email').sort({
            createdAt: -1
        }).lean();
        const data = tickets.map((ticket)=>({
                id: ticket._id.toString(),
                ticketId: ticket.ticketId || '',
                vendorId: ticket.vendorId?._id?.toString() || ticket.vendorId?.toString() || '',
                vendor: ticket.vendorId?.businessName || '',
                userId: ticket.userId?._id?.toString() || ticket.userId?.toString() || '',
                user: ticket.userId?.name || ticket.userId?.email || '',
                title: ticket.title || '',
                description: ticket.description || '',
                priority: ticket.priority || 'low',
                status: ticket.status || 'open',
                attachment: ticket.attachment?.name || '',
                attachmentUrl: ticket.attachment?.url || '',
                attachmentData: ticket.attachment?.data || '',
                resolution: ticket.resolution || '',
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to fetch tickets',
            error: error.message
        }, {
            status: 500
        });
    }
});
const POST = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$cors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCORS"])(async (request)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        const ticket = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$src$2f$models$2f$Ticket$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            vendorId: body.vendorId,
            userId: body.userId,
            title: body.title,
            description: body.description,
            priority: body.priority || 'low',
            status: body.status || 'open',
            attachment: body.attachment || {}
        });
        await ticket.save();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                id: ticket._id.toString(),
                ticketId: ticket.ticketId,
                ...ticket.toObject()
            }
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$wedding$2f$wedding$2f$server$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to create ticket',
            error: error.message
        }, {
            status: 500
        });
    }
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__74152e13._.js.map