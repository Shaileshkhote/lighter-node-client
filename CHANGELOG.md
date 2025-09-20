# Changelog

## [1.0.0] - 2025-09-20

### Added
- Initial release of Lighter TypeScript client
- Native Go signer binary integration via Koffi FFI
- Complete API coverage matching Python implementation
- Cross-platform support (macOS ARM64, Linux x64)
- Full TypeScript type definitions

### Features
- **Order Operations**: Create, cancel, modify orders (market, limit, post-only)
- **Account Management**: Withdraw, transfer, sub-accounts, leverage updates
- **Pool Operations**: Create pools, mint/burn shares
- **Authentication**: API key generation, auth tokens, client management
- **Error Handling**: Comprehensive error handling and validation
- **Type Safety**: Full TypeScript support with IntelliSense

### Technical Details
- Uses Koffi for FFI bindings (no native compilation required)
- Automatic platform detection and binary loading
- Proper C type mapping for all function signatures
- JSON response parsing and error handling

### Tested Functions
- ✅ Market orders, limit orders, post-only orders
- ✅ Order cancellation and modification
- ✅ Cancel all orders
- ✅ Withdrawals and transfers
- ✅ Sub-account creation
- ✅ Leverage updates (cross/isolated margin)
- ✅ Pool creation and share management
- ✅ API key generation and auth tokens
- ✅ Client status checks and API key switching