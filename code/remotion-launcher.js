// Remotion Studio launcher
// Remotion が process.cwd() で package.json を探すため、
// supplement-oracle-ad ディレクトリに chdir してから起動する
const path = require('path');
process.chdir(path.join(__dirname, 'supplement-oracle-ad'));
require('./supplement-oracle-ad/node_modules/@remotion/cli/remotion-cli.js');
