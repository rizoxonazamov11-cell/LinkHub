const { spawn } = require('child_process');

const child = spawn('cmd.exe', ['/c', 'npx surge . azamov-muhammadrizo.surge.sh'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('STDOUT:', str);
  if (str.includes('email:')) {
    child.stdin.write('azamov.muhammadrizo.dev@gmail.com\n');
  } else if (str.includes('password:')) {
    child.stdin.write('Muhammadrizo2026!\n');
  }
});

child.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString());
});

child.on('close', (code) => {
  console.log('Finished with code:', code);
});
