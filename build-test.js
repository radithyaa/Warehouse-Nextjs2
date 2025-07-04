const { exec } = require('child_process');

console.log('Starting build test...');

// Test prisma generate first
exec('npx prisma generate', { cwd: 'D:\\Code Projects\\mvp-warehouse' }, (error, stdout, stderr) => {
  if (error) {
    console.error('Prisma generate error:', error);
    return;
  }
  
  console.log('Prisma generate output:', stdout);
  if (stderr) console.error('Prisma generate stderr:', stderr);
  
  // Then try to build
  exec('npm run build', { cwd: 'D:\\Code Projects\\mvp-warehouse' }, (error, stdout, stderr) => {
    if (error) {
      console.error('Build error:', error);
      return;
    }
    
    console.log('Build output:', stdout);
    if (stderr) console.error('Build stderr:', stderr);
    
    console.log('Build test completed successfully!');
  });
});
