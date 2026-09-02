// Railway entrypoint - starts Next.js standalone server
// Note: next.config.ts uses output: 'standalone' so we must run the standalone bundle,
// not `next start`. This file expects Railway to provide DATABASE_URL (and optionally
// REDIS_URL) as environment variables - the PostgreSQL plugin auto-populates these.

const path = require('path');
const { spawn } = require('child_process');
const nextStandalone = path.join(process.cwd(), '.next', 'standalone', 'server.js');

// Log startup info (helpful in Railway logs)
console.log('[server.js] Starting Next.js standalone server...');
console.log('[server.js] NODE_ENV:', process.env.NODE_ENV);
console.log('[server.js] PORT:', process.env.PORT);
console.log('[server.js] DATABASE_URL set:', !!process.env.DATABASE_URL);

const child = spawn('node', [nextStandalone], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  console.log(`[server.js] Next.js exited with code ${code}`);
  process.exit(code ?? 0);
});

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
