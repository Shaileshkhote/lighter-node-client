# lighter-node-client

A complete TypeScript client for the Lighter trading platform with native Go signer bindings via FFI.

> **⚠️ IMPORTANT**: This package is **Server-Side Only** and works exclusively with **Node.js**. It cannot be used in browsers due to native binary dependencies and FFI requirements.

<!-- [![npm version](https://badge.fury.io/js/%40lighter%2Fnode-client.svg)](https://www.npmjs.com/package/) -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-macOS%20ARM64%20%7C%20Linux%20x64-blue.svg)]()
[![Server Side](https://img.shields.io/badge/Environment-Node.js%20Server%20Only-red.svg)]()

## Features

- 🚀 **Native Performance**: Uses compiled Go binaries for cryptographic operations
- 🌍 **Cross-Platform**: Supports macOS (ARM64) and Linux (x64)
- 🔒 **Type Safe**: Full TypeScript support with comprehensive type definitions
- 📦 **Complete API**: All signer functions from the Python implementation
- ⚡ **Easy Setup**: One-command installation and setup
- 🎯 **Production Ready**: Error handling, validation, and proper npm packaging

## Installation

### From GitHub

```bash
# Clone the repository
git clone https://github.com/Shaileshkhote/lighter-node-client.git
cd lighter-node-client
npm run build
### Alternative Installation

```bash
# Download and extract
wget https://github.com/Shaileshkhote/lighter-node-client/archive/main.zip
unzip main.zip
cd lighter-node-client-main
npm run build
```

## Quick Start

```typescript
import { LighterClient, ORDER_TYPES, TIME_IN_FORCE } from './src';

// Create client with environment variables
const client = new LighterClient(
  process.env.LIGHTER_API_URL || 'https://testnet.zklighter.elliot.ai',
  process.env.LIGHTER_PRIVATE_KEY || 'your-private-key-here',
  parseInt(process.env.LIGHTER_API_KEY_INDEX || '0'),
  parseInt(process.env.LIGHTER_ACCOUNT_INDEX || '12345')
);

// Initialize
client.initialize();

// Create a market order
const orderSignature = client.createOrder({
  marketIndex: parseInt(process.env.LIGHTER_MARKET_INDEX || '0'),
  clientOrderIndex: Date.now(),
  baseAmount: 100,
  price: 50000,
  isAsk: false,
  orderType: ORDER_TYPES.MARKET,
  timeInForce: TIME_IN_FORCE.IMMEDIATE_OR_CANCEL,
  orderExpiry: 0,
  nonce: Date.now()
});

console.log('Order signed:', orderSignature);
```

## Environment Variables

Create a `.env` file or set environment variables:

```bash
# Required
LIGHTER_PRIVATE_KEY=your-private-key-here
LIGHTER_ACCOUNT_INDEX=12345
LIGHTER_API_KEY_INDEX=0

# Optional
LIGHTER_API_URL=https://testnet.zklighter.elliot.ai  # or mainnet URL
LIGHTER_MARKET_INDEX=0
```

## Complete API Reference

### Core Client

```typescript
// Initialize client with environment variables
const client = new LighterClient(
  process.env.LIGHTER_API_URL || 'https://testnet.zklighter.elliot.ai',
  process.env.LIGHTER_PRIVATE_KEY || 'your-private-key-here',
  parseInt(process.env.LIGHTER_API_KEY_INDEX || '0'),
  parseInt(process.env.LIGHTER_ACCOUNT_INDEX || '12345')
);
client.initialize();

// Generate API key
const apiKey = LighterClient.generateApiKey('optional-seed');
```

### Order Operations

```typescript
// Create order
client.createOrder({
  marketIndex: parseInt(process.env.LIGHTER_MARKET_INDEX || '0'),
  clientOrderIndex: Date.now(),
  baseAmount: 100,
  price: 50000,
  isAsk: false,
  orderType: ORDER_TYPES.MARKET,
  timeInForce: TIME_IN_FORCE.IMMEDIATE_OR_CANCEL,
  orderExpiry: 0,
  nonce: Date.now()
});

// Cancel order
client.cancelOrder({
  marketIndex: parseInt(process.env.LIGHTER_MARKET_INDEX || '0'),
  orderIndex: 281474976710656, // Example order index
  nonce: Date.now() + 1
});

// Modify order
client.modifyOrder({
  marketIndex: parseInt(process.env.LIGHTER_MARKET_INDEX || '0'),
  orderIndex: 281474976710656,
  baseAmount: 200,
  price: 55000,
  triggerPrice: 0,
  nonce: Date.now() + 2
});

// Cancel all orders
client.cancelAllOrders({
  timeInForce: CANCEL_ALL_TIF.IMMEDIATE,
  time: 0,
  nonce: Date.now() + 3
});
```

### Account Operations

```typescript
// Withdraw funds
client.withdraw({
  amount: 1000000, // 1 USDC (scaled by 1e6)
  nonce: Date.now()
});

// Transfer funds
client.transfer({
  toAccountIndex: parseInt(process.env.LIGHTER_TO_ACCOUNT || '67890'),
  amount: 5000000,
  fee: 1000,
  memo: '12345678901234567890123456789012', // 32-byte memo
  nonce: Date.now() + 1
});

// Create sub-account
client.createSubAccount(Date.now() + 2);

// Update leverage
client.updateLeverage({
  marketIndex: parseInt(process.env.LIGHTER_MARKET_INDEX || '0'),
  fraction: 5000, // 5x leverage
  marginMode: MARGIN_MODES.CROSS,
  nonce: Date.now() + 3
});
```

### Pool Operations

```typescript
// Create public pool
client.createPublicPool({
  operatorFee: 100000,
  initialTotalShares: 1000000000,
  minOperatorShareRate: 50000,
  nonce: 34
});

// Mint/Burn shares
client.mintShares({
  publicPoolIndex: 1,
  shareAmount: 100000000,
  nonce: 35
});

client.burnShares({
  publicPoolIndex: 1,
  shareAmount: 50000000,
  nonce: 36
});
```

### Authentication & Utilities

```typescript
// Create auth token
const authToken = client.createAuthToken(
  Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
);

// Check client status
client.checkClient();

// Switch API key
client.switchApiKey(3);

// Change public key
client.changePubKey('new-public-key', 37);
```

## Constants & Types

```typescript
import { 
  ORDER_TYPES,
  TIME_IN_FORCE,
  CANCEL_ALL_TIF,
  MARGIN_MODES,
  CONSTANTS
} from './src';

// Order Types
ORDER_TYPES.LIMIT          // 0
ORDER_TYPES.MARKET         // 1
ORDER_TYPES.STOP_LOSS      // 2
// ... etc

// Time In Force
TIME_IN_FORCE.IMMEDIATE_OR_CANCEL  // 0
TIME_IN_FORCE.GOOD_TILL_TIME       // 1
TIME_IN_FORCE.POST_ONLY            // 2

// Margin Modes
MARGIN_MODES.CROSS     // 0
MARGIN_MODES.ISOLATED  // 1

// Constants
CONSTANTS.USDC_TICKER_SCALE         // 1e6
CONSTANTS.DEFAULT_IOC_EXPIRY        // 0
CONSTANTS.DEFAULT_28_DAY_ORDER_EXPIRY // -1
```

## Compatibility

### ⚠️ Environment Requirements
- ✅ **Node.js Server-Side** - Required (backend applications, scripts, APIs)
- ❌ **Browser/Frontend** - Not supported (native binaries cannot run in browsers)
- ❌ **React/Vue/Angular** - Not supported for client-side use
- ❌ **Webpack/Vite** - Cannot be bundled for browser use
- ✅ **Electron** - Supported (Node.js runtime in desktop apps)
- ✅ **Docker** - Supported (Linux containers)

### Node.js Versions
- ✅ **Node.js 16.x** - Fully supported
- ✅ **Node.js 18.x** - Fully supported  
- ✅ **Node.js 20.x** - Fully supported
- ✅ **Node.js 22.x** - Fully supported
- ✅ **Node.js 24.x** - Fully supported (tested with v24.8.0)

### Platform Support

| Platform | Architecture | Status | Binary File |
|----------|-------------|--------|-------------|
| macOS    | ARM64 (M1/M2/M3) | ✅ **Fully Supported** | `signer-arm64.dylib` |
| Linux    | x64/AMD64 | ✅ **Fully Supported** | `signer-amd64.so` |
| Windows  | x64 | ❌ **Not Supported** | N/A |
| macOS    | Intel x64 | ❌ **Not Supported** | N/A |
| Linux    | ARM64 | ❌ **Not Supported** | N/A |

### Package Managers
- ✅ **npm** - Primary support
- ✅ **yarn** - Compatible
- ✅ **pnpm** - Compatible
- ✅ **bun** - Compatible (with Node.js compatibility mode)

### TypeScript Versions
- ✅ **TypeScript 4.x** - Supported
- ✅ **TypeScript 5.x** - Fully supported (recommended)

### FFI Library
- Uses **Koffi v2.8.0+** for native bindings
- No native compilation required (unlike node-gyp based solutions)
- Compatible with all supported Node.js versions

## Error Handling

All methods throw descriptive errors:

```typescript
try {
  const signature = client.createOrder(params);
  console.log('Success:', signature);
} catch (error) {
  console.error('Failed to sign order:', error.message);
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Setup (copies binaries)
npm run setup
```

## Requirements

- **Node.js**: >= 16.0.0
- **Platforms**: macOS (ARM64), Linux (x64)
- **Signer Binaries**: Included in package

## Troubleshooting

### Platform Issues

**"Unsupported platform" Error:**
```bash
Error: Unsupported platform: win32/x64
```
- **Solution**: This package only supports macOS ARM64 and Linux x64
- **Alternative**: Use the Python client on unsupported platforms

**"Signer binary not found" Error:**
```bash
Error: Signer binary not found at: /path/to/signer-arm64.dylib
```
 - **Solution**:Manually copy binaries from `../lighter/signers/`

### Node.js Version Issues

**"Cannot find module 'koffi'" Error:**
```bash
Error: Cannot find module 'koffi'
```
- **Solution**: Install dependencies: `npm install`
- **Check**: Ensure Node.js >= 16.0.0: `node --version`

### FFI Loading Issues

**"Failed to load signer library" Error:**
```bash
Error: Failed to load signer library: dlopen failed
```
- **macOS**: Check if binary is signed/notarized: `codesign -v signers/signer-arm64.dylib`
- **Linux**: Check if binary has execute permissions: `chmod +x signers/signer-amd64.so`
- **Both**: Verify binary architecture matches system: `file signers/signer-*.{so,dylib}`

### Validation Errors

**"OrderExpiry is invalid" Error:**
- **Market Orders**: Use `orderExpiry: 0` with `timeInForce: 0` (IOC)
- **Limit Orders**: Use `orderExpiry: -1` with `timeInForce: 1` (GTT)

**"OrderIndex should not be less than" Error:**
- **Solution**: Use realistic order indices (e.g., `281474976710656` or higher)

### Development Issues

**TypeScript Compilation Errors:**
```bash
npm run build
# Fix any type errors in src/ files
```

**Test Failures:**
```bash
# Run individual test categories
npm run test:orders
npm run test:account
npm run test:pools
npm run test:auth
```

## Binary Files

The package includes native signer binaries compiled from the [Lighter Go SDK](https://github.com/elliottech/lighter-go):

- `signers/signer-arm64.dylib` (macOS ARM64)
- `signers/signer-amd64.so` (Linux x64)

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/Shaileshkhote/lighter-node-client/issues)
- **Documentation**: This README
- **Examples**: See `examples/` directory
