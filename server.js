// Railway entrypoint - starts Next.js standalone server
const { exec } = require('child_process');

// Run any pending migrations
const migrate = () => {
  return new Promise((resolve) => {
    exec('npx prisma migrate deploy', (err) => {
      if (err) {
        console.log('Migration deploy note:', err.message);
      }
      resolve(true);
    });
  });
};

migrate().then(() => {
  const port = process.env.PORT || 8080;
  const args = ['start', '-p', String(port)];
  const next = require.resolve('next/dist/bin/next');
  require('child_process').spawnSync('node', [next, ...args], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
});
