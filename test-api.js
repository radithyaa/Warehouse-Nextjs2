const { exec } = require('child_process');

// Function to test API endpoints
async function testAPI() {
  console.log('🚀 Starting API Test...\n');
  
  const baseURL = 'http://localhost:3000';
  
  const testCases = [
    {
      name: 'GET /api/products',
      url: `${baseURL}/api/products`,
      method: 'GET'
    },
    {
      name: 'POST /api/products',
      url: `${baseURL}/api/products`,
      method: 'POST',
      data: {
        name: 'Test Product',
        code: 'TEST001',
        unit: 'pcs',
        category: 'Electronics'
      }
    },
    {
      name: 'GET /api/warehouses',
      url: `${baseURL}/api/warehouses`,
      method: 'GET'
    },
    {
      name: 'POST /api/warehouses',
      url: `${baseURL}/api/warehouses`,
      method: 'POST',
      data: {
        name: 'Test Warehouse',
        location: 'Jakarta'
      }
    },
    {
      name: 'GET /api/products/available',
      url: `${baseURL}/api/products/available?warehouseId=1`,
      method: 'GET'
    }
  ];

  console.log('Available test cases:');
  testCases.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
  });
  
  console.log('\n⚠️  To run these tests, start the development server with:');
  console.log('npm run dev');
  console.log('\nThen use a tool like curl or Postman to test the endpoints.');
  console.log('\nExample curl commands:');
  
  testCases.forEach(test => {
    if (test.method === 'GET') {
      console.log(`curl -X GET "${test.url}"`);
    } else if (test.method === 'POST') {
      console.log(`curl -X POST "${test.url}" -H "Content-Type: application/json" -d '${JSON.stringify(test.data)}'`);
    }
  });
}

// Check if Prisma is properly configured
console.log('🔍 Checking Prisma configuration...');
exec('npx prisma generate', { cwd: 'D:\\Code Projects\\mvp-warehouse' }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Prisma generate error:', error.message);
    return;
  }
  
  if (stderr) {
    console.error('⚠️  Prisma generate stderr:', stderr);
  }
  
  console.log('✅ Prisma client generated successfully');
  
  // Check if schema is valid
  exec('npx prisma validate', { cwd: 'D:\\Code Projects\\mvp-warehouse' }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Prisma schema validation error:', error.message);
      return;
    }
    
    console.log('✅ Prisma schema is valid');
    
    // Test build
    console.log('\n🏗️  Testing build process...');
    exec('npm run build', { cwd: 'D:\\Code Projects\\mvp-warehouse' }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Build error:', error.message);
        console.error('Build stdout:', stdout);
        console.error('Build stderr:', stderr);
        return;
      }
      
      console.log('✅ Build successful!');
      testAPI();
    });
  });
});
