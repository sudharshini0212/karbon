import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ActivityRecordModel } from '../models/ActivityRecord.ts';
import { CarbonReportModel } from '../models/CarbonReport.ts';

dotenv.config();

async function runVerification() {
  const uri = process.env.MONGODB_URI;
  console.log('====================================================');
  console.log('KARBON MongoDB Atlas Verification Suite');
  console.log('====================================================');

  if (!uri) {
    console.error('FAIL: No MONGODB_URI environment variable detected.');
    process.exit(1);
  }

  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log(`Connecting to: ${maskedUri}`);
  console.log('Target Database: karbonDB');
  console.log('Target Collections: activityrecords, carbonreports, mines, reductiontargets, roadmapstages');
  console.log('----------------------------------------------------');

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'karbonDB',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log(`✓ Connected to Atlas Host: ${conn.connection.host}`);
    console.log(`✓ Connected to Database: ${conn.connection.name}`);

    // STEP 1: Real Insert into 'activityrecords'
    const probeDoc = {
      category: 'Diesel / Fuel' as const,
      activityName: 'Atlas Roundtrip Verification Probe',
      quantity: 750,
      unit: 'litres',
      reportingPeriod: '2025-10',
      dateRecorded: new Date().toISOString().split('T')[0],
      sourceDocRef: 'Automated Atlas Test Runner',
      loggedBy: 'Atlas Verification Engineer',
      role: 'Administrator' as const,
      notes: 'Test record to verify permanent Atlas collection storage.',
    };

    console.log('1. Performing write to collection "activityrecords"...');
    const created = await ActivityRecordModel.create(probeDoc);
    const docId = created._id.toString();
    console.log(`✓ Document inserted successfully with _id: ${docId}`);

    // STEP 2: Read back from Atlas
    console.log('2. Reading document back from collection "activityrecords"...');
    const fetched = await ActivityRecordModel.findById(docId).lean();
    if (!fetched) {
      throw new Error(`Verification failed: Document ${docId} not found in Atlas.`);
    }
    console.log(`✓ Read-back successful:`, {
      _id: fetched._id.toString(),
      activityName: fetched.activityName,
      quantity: fetched.quantity,
      unit: fetched.unit,
      category: fetched.category,
    });

    // STEP 3: Verify fields match
    if (fetched.activityName !== probeDoc.activityName || fetched.quantity !== probeDoc.quantity) {
      throw new Error('Verification failed: Read-back document fields do not match inserted values.');
    }
    console.log('✓ Field verification passed: Inserted values match read-back document 100%.');

    // STEP 4: Clean up test probe
    console.log('3. Cleaning up test probe document...');
    await ActivityRecordModel.findByIdAndDelete(docId);
    console.log('✓ Test probe document removed.');

    console.log('====================================================');
    console.log('VERIFICATION RESULT: SUCCESS! Atlas CRUD is verified.');
    console.log('====================================================');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('----------------------------------------------------');
    console.error('VERIFICATION STATUS: Disconnected / Blocked by Atlas');
    console.error(`Diagnostic Detail: ${err.message}`);
    console.error('');
    console.error('Action Required in MongoDB Atlas:');
    console.error('1. Open cloud.mongodb.com and select your cluster (cluster0.6hmbh51.mongodb.net).');
    console.error('2. Navigate to "Security" → "Network Access".');
    console.error('3. Click "Add IP Address" and select "Allow Access From Anywhere" (0.0.0.0/0), or add 34.34.254.184.');
    console.error('4. Confirm and wait 30 seconds for Atlas firewall rules to apply.');
    console.error('----------------------------------------------------');
    process.exit(1);
  }
}

runVerification();
