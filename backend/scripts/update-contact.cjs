const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Supabase Postgres!');

  // Check current contact_info
  const res = await client.query("SELECT * FROM site_content WHERE key = 'contact_info'");
  console.log('Current rows:', res.rows.length);
  
  let currentData = {};
  if (res.rows.length > 0) {
    currentData = res.rows[0].data || {};
    console.log('Current data:', currentData);
  }

  // Update with 9989608595
  const updatedData = {
    ...currentData,
    whatsapp: '+919989608595',
    phone: '+919989608595',
    email: currentData.email || 'an@sreshta.com',
    corporateEmail: currentData.corporateEmail || 'corporate.sales@sreshta.com',
    salesEmail: currentData.salesEmail || 'sales@sreshta.com',
    supportEmail: currentData.supportEmail || 'support@sreshta.com',
    instagram: currentData.instagram || 'https://www.instagram.com/sreshtasilver_92.5?igsh=dnRiOTY4YWlzb2oy',
    youtube: currentData.youtube || 'https://www.youtube.com',
    addresses: currentData.addresses || [
      'Sreshta Jewellery and Lifestyle Limited\nNo. 8-2-293/82/A/270, Road No. 36,\nJubilee Hills, Hyderabad – 500033\nTelangana, India',
      'Sreshta Jewellery and Lifestyle Limited\n302, Dhantak Plaza, Makwana Road,\nMarol, Andheri (East)\nMumbai-59\nMaharashtra, India'
    ]
  };

  await client.query(`
    INSERT INTO site_content (key, data, updated_at)
    VALUES ('contact_info', $1, NOW())
    ON CONFLICT (key) DO UPDATE
    SET data = $1, updated_at = NOW()
  `, [JSON.stringify(updatedData)]);

  console.log('Successfully updated contact_info in database with +919989608595!');

  // Verify
  const verify = await client.query("SELECT * FROM site_content WHERE key = 'contact_info'");
  console.log('Verified database record:', JSON.stringify(verify.rows[0].data, null, 2));

  await client.end();
}

run().catch(console.error);

