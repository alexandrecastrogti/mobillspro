import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 Iniciando MobillsPro Full-Stack (Server + Client Vite)...');

// Start backend
const serverProcess = spawn('node', ['server/src/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// Start client Vite
const clientProcess = spawn('npm', ['run', 'dev', '--prefix', 'client'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
  clientProcess.kill('SIGINT');
  process.exit();
});
