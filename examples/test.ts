import { LighterClient, ORDER_TYPES, TIME_IN_FORCE } from '../src';
import process from 'process';

async function main() {
    try {
        console.log('🚀 Lighter TypeScript Client Test\n');

        // Configuration from environment variables
        const privateKey = process.env.LIGHTER_PRIVATE_KEY;
        const API_KEY_INDEX = parseInt(process.env.LIGHTER_API_KEY_INDEX || '0');
        const ACCOUNT_INDEX = parseInt(process.env.LIGHTER_ACCOUNT_INDEX || '12345');
        const API_URL = process.env.LIGHTER_API_URL || 'https://testnet.zklighter.elliot.ai';

        if (!privateKey) {
            console.error('❌ Error: LIGHTER_PRIVATE_KEY environment variable is required');
            console.log('Please set your private key: export LIGHTER_PRIVATE_KEY=your-actual-private-key');
            process.exit(1);
        }

        console.log('Using Configuration:', {
            apiUrl: API_URL,
            apiKeyIndex: API_KEY_INDEX,
            accountIndex: ACCOUNT_INDEX,
            privateKeySet: true
        });

        // Create client
        const client = new LighterClient(
            API_URL,
            privateKey,
            API_KEY_INDEX,
            ACCOUNT_INDEX
        );

        // Initialize
        console.log('\nInitializing client...');
        client.initialize();
        console.log('✅ Client initialized successfully');

        // Check client status
        console.log('\nChecking client status...');
        try {
            client.checkClient();
            console.log('✅ Client check passed');
        } catch (error) {
            console.log('⚠️  Client check failed (expected for demo):', error instanceof Error ? error.message : String(error));
        }

        // Create market order
        console.log('\nCreating a market order...');
        const orderSignature = client.createOrder({
            marketIndex: parseInt(process.env.LIGHTER_MARKET_INDEX || '0'),
            clientOrderIndex: Date.now(),
            baseAmount: 100,
            price: 50000,
            isAsk: false,
            orderType: ORDER_TYPES.MARKET,
            timeInForce: TIME_IN_FORCE.IMMEDIATE_OR_CANCEL,
            reduceOnly: false,
            triggerPrice: 0,
            orderExpiry: 0,
            nonce: Date.now()
        });
        console.log('✅ Order signature:', orderSignature);

        // Cancel order
        console.log('\nCanceling order...');
        const cancelSignature = client.cancelOrder({
            marketIndex: parseInt(process.env.LIGHTER_MARKET_INDEX || '0'),
            orderIndex: 281474976710656,
            nonce: Date.now() + 1
        });
        console.log('✅ Cancel signature:', cancelSignature.substring(0, 50) + '...');

        // Create authentication token
        console.log('\nCreating authentication token...');
        const deadline = Math.floor(Date.now() / 1000) + 3600;
        const authToken = client.createAuthToken(deadline);
        console.log('✅ Auth token:', authToken.substring(0, 50) + '...');

        console.log('\n🎉 All operations completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        // Remove process.exit(1) for environments where 'process' is not defined
    }
}

main();
