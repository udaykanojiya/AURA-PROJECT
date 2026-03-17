const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

console.log('--- Testing Models ---');
files.forEach(file => {
  if (file.endsWith('.js')) {
    try {
      require(`./models/${file}`);
      console.log(`✅ ${file} is valid`);
    } catch (err) {
      console.error(`❌ Error in ${file}:`, err.message);
    }
  }
});
console.log('--- Done ---');
