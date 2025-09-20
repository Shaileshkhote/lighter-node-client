# Lighter TypeScript Client Examples

This directory contains comprehensive examples demonstrating all functions of the Lighter TypeScript client.

## Test Files

### 🎯 Individual Function Tests

#### `test-orders.ts` - Order Operations
Tests all order-related functionality:
- ✅ Market Orders
- ✅ Limit Orders  
- ✅ Stop Loss Orders
- ✅ Modify Orders
- ✅ Cancel Specific Orders
- ✅ Cancel All Orders

```bash
npx ts-node examples/test-orders.ts
```

#### `test-account.ts` - Account Operations  
Tests all account management functions:
- ✅ Withdraw Funds
- ✅ Transfer Funds
- ✅ Create Sub-Accounts
- ✅ Update Leverage (Cross & Isolated)
- ✅ Change Public Key

```bash
npx ts-node examples/test-account.ts
```

#### `test-pools.ts` - Pool Operations
Tests liquidity pool functionality:
- ✅ Create Public Pools
- ✅ Update Public Pools
- ✅ Mint Shares
- ✅ Burn Shares

```bash
npx ts-node examples/test-pools.ts
```

#### `test-auth.ts` - Authentication & Utilities
Tests authentication and client management:
- ✅ Generate API Keys
- ✅ Client Status Checks
- ✅ Create Auth Tokens (various expiries)
- ✅ Switch API Keys

```bash
npx ts-node examples/test-auth.ts
```

### 🚀 Complete Test Suite

#### `test-all.ts` - Run All Tests
Executes all test categories in sequence:

```bash
npx ts-node examples/test-all.ts
```

#### `test.ts` - Basic Integration Test
Simple test demonstrating core functionality:

```bash
npm test
```

## Test Configuration

All tests use environment variables for configuration. Set up your `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
LIGHTER_PRIVATE_KEY=your-private-key-here
LIGHTER_ACCOUNT_INDEX=12345
LIGHTER_API_KEY_INDEX=0
LIGHTER_API_URL=https://testnet.zklighter.elliot.ai
LIGHTER_MARKET_INDEX=0
```

Tests will use these environment variables or safe defaults:

```typescript
const API_KEY = process.env.LIGHTER_PRIVATE_KEY || 'your-private-key-here';
const URL = process.env.LIGHTER_API_URL || 'https://testnet.zklighter.elliot.ai';
const API_KEY_INDEX = parseInt(process.env.LIGHTER_API_KEY_INDEX || '0');
const ACCOUNT_INDEX = parseInt(process.env.LIGHTER_ACCOUNT_INDEX || '12345');
const MARKET_INDEX = parseInt(process.env.LIGHTER_MARKET_INDEX || '0');
```

## Expected Output

Each test will show:
- ✅ Successful operations with signature previews
- ⚠️  Expected failures (e.g., API key validation)
- 📋 Clear operation descriptions
- 🎉 Completion confirmation

## Test Results

All tests demonstrate that the TypeScript client successfully:

1. **Loads Native Binaries**: Uses Go signer via FFI
2. **Signs Transactions**: Generates valid signatures
3. **Handles All Operations**: Complete API coverage
4. **Type Safety**: Full TypeScript validation
5. **Error Handling**: Graceful failure management

## Running Individual Functions

You can also test individual functions by importing them:

```typescript
import { LighterClient, ORDER_TYPES } from '@lighter/ts-client';

const client = new LighterClient(url, privateKey, apiKeyIndex, accountIndex);
client.initialize();

// Test any function
const signature = client.createOrder({...});
```

## Notes

- Some operations may fail with "api key not registered" - this is expected for demo keys
- All signature generation works correctly regardless of registration status
- Tests demonstrate the complete functionality of the native Go signer integration
