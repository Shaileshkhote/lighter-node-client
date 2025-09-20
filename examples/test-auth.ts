/**
 * Authentication & Utility Test
 */

import { LighterClient } from '../src';
import process from 'process';

const API_KEY = process.env.LIGHTER_PRIVATE_KEY;

if (!API_KEY) {
    console.error('❌ Error: LIGHTER_PRIVATE_KEY environment variable is required');
    process.exit(1);
}
const URL = process.env.LIGHTER_API_URL || 'https://testnet.zklighter.elliot.ai';
const API_KEY_INDEX = parseInt(process.env.LIGHTER_API_KEY_INDEX || '0');
const ACCOUNT_INDEX = parseInt(process.env.LIGHTER_ACCOUNT_INDEX || '12345');

async function testAuthOperations() {
    console.log('🔐 Testing Authentication & Utility Operations\n');

    const client = new LighterClient(URL, API_KEY, API_KEY_INDEX, ACCOUNT_INDEX);
    client.initialize();

    try {
        // Test 1: Generate API Key
        console.log('1. Generating New API Key...');
        const newApiKey = LighterClient.generateApiKey('test-seed-123');
        if (newApiKey.error) {
            console.log('❌ API Key Generation Error:', newApiKey.error);
        } else {
            console.log('✅ Generated API Key:');
            console.log('   Private Key:', newApiKey.privateKey?.substring(0, 20) + '...');
            console.log('   Public Key:', newApiKey.publicKey?.substring(0, 20) + '...\n');
        }

        // Test 2: Client Check (may fail if API key not registered)
        console.log('2. Checking Client Status...');
        try {
            client.checkClient();
            console.log('✅ Client check passed\n');
        } catch (error) {
            console.log('⚠️  Client check failed (expected for demo):',
                error instanceof Error ? error.message : String(error), '\n');
        }

        // Test 3: Create Short-term Auth Token (10 minutes)
        console.log('3. Creating Short-term Auth Token (10 min)...');
        const shortAuthToken = client.createAuthToken(
            Math.floor(Date.now() / 1000) + 600 // 10 minutes from now
        );
        const shortTokenParts = shortAuthToken.split(':');
        console.log('✅ Short Auth Token:');
        console.log('   Deadline:', new Date(parseInt(shortTokenParts[0]) * 1000).toISOString());
        console.log('   Account Index:', shortTokenParts[1]);
        console.log('   API Key Index:', shortTokenParts[2]);
        console.log('   Signature:', shortTokenParts[3].substring(0, 20) + '...\n');

        // Test 4: Create Long-term Auth Token (1 hour)
        console.log('4. Creating Long-term Auth Token (1 hour)...');
        const longAuthToken = client.createAuthToken(
            Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        );
        const longTokenParts = longAuthToken.split(':');
        console.log('✅ Long Auth Token:');
        console.log('   Deadline:', new Date(parseInt(longTokenParts[0]) * 1000).toISOString());
        console.log('   Account Index:', longTokenParts[1]);
        console.log('   API Key Index:', longTokenParts[2]);
        console.log('   Signature:', longTokenParts[3].substring(0, 20) + '...\n');

        // Test 5: Create Auth Token with Default Expiry
        console.log('5. Creating Default Auth Token...');
        const defaultAuthToken = client.createAuthToken();
        const defaultTokenParts = defaultAuthToken.split(':');
        console.log('✅ Default Auth Token:');
        console.log('   Deadline:', new Date(parseInt(defaultTokenParts[0]) * 1000).toISOString());
        console.log('   Account Index:', defaultTokenParts[1]);
        console.log('   API Key Index:', defaultTokenParts[2]);
        console.log('   Signature:', defaultTokenParts[3].substring(0, 20) + '...\n');

        // Test 6: Switch API Key (will likely fail but demonstrates the function)
        console.log('6. Testing API Key Switch...');
        try {
            client.switchApiKey(3);
            console.log('✅ API Key switched to index 3\n');
        } catch (error) {
            console.log('⚠️  API Key switch failed (expected):',
                error instanceof Error ? error.message : String(error), '\n');
        }

        console.log('🎉 All authentication operations completed successfully!');

    } catch (error) {
        console.error('❌ Error in authentication operations:', error instanceof Error ? error.message : String(error));
    }
}

(async () => {
    await testAuthOperations();
})();
