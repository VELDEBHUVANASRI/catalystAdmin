import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Vendor from '@/models/Vendor';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async () => {
  try {
    await dbConnect();
    
    // Get database information
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    // Get collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get vendor collection stats
    const vendorCollection = db.collection('vendors');
    const totalCount = await vendorCollection.countDocuments();
    const pendingCount = await vendorCollection.countDocuments({ status: 'pending' });
    
    // Get a sample pending vendor
    const sampleVendor = await vendorCollection.findOne({ status: 'pending' });
    
    return NextResponse.json({
      success: true,
      debug: {
        database: dbName,
        collections: collectionNames,
        totalVendors: totalCount,
        pendingVendors: pendingCount,
        sampleVendor: sampleVendor ? {
          ...sampleVendor,
          _id: sampleVendor._id.toString()
        } : null,
        mongooseModel: {
          collectionName: Vendor.collection.name,
          modelName: Vendor.modelName,
          schema: Object.keys(Vendor.schema.paths)
        }
      }
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});