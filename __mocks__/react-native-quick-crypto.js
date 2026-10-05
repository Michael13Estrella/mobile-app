// Shim the native module to Node's built-in crypto for tests.
// quick-crypto mirrors Node's crypto API, so the real algorithms run.
const nodeCrypto = require("node:crypto");
const { Buffer } = require("node:buffer");

module.exports = nodeCrypto; // default import: `import QuickCrypto from ...`
module.exports.Buffer = Buffer; // named import: `import { Buffer } from ...`
