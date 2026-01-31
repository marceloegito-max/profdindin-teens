const https = require('https');

const testCredentials = [
  { email: 'admin@dindinteens.com.br', password: 'admin123', role: 'Admin' },
  { email: 'lucas@teste.com', password: 'teen123', role: 'Teen' },
  { email: 'maria@escola.com', password: 'prof123', role: 'Professor' },
  { email: 'ana@teste.com', password: 'resp123', role: 'Responsável' }
];

async function testLogin(email, password, role) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      email: email,
      password: password
    });

    const options = {
      hostname: 'profdindin-teens.vercel.app',
      port: 443,
      path: '/api/auth/callback/credentials',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`${role}: Status ${res.statusCode} - ${res.statusCode === 200 || res.statusCode === 302 ? '✅ OK' : '❌ FALHA'}`);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`${role}: ❌ ERRO - ${error.message}`);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testando credenciais de login...\n');
  
  for (const cred of testCredentials) {
    await testLogin(cred.email, cred.password, cred.role);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Testes de login concluídos!');
}

runTests();
