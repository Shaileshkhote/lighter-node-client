/**
 * Account Operations Test
 */

import {
    LighterClient,
    MARGIN_MODES
} from '../src';
import process from 'process';

const API_KEY = process.env.LIGHTER_PRIVATE_KEY;

if (!API_KEY) {
    console.error('❌ Error: LIGHTER_PRIVATE_KEY environment variable is required');
    process.exit(1);
}
const URL = process.env.LIGHTER_API_URL || 'https://testnet.zklighter.elliot.ai';
const API_KEY_INDEX = parseInt(process.env.LIGHTER_API_KEY_INDEX || '0');
const ACCOUNT_INDEX = parseInt(process.env.LIGHTER_ACCOUNT_INDEX || '12345');

async function testAccountOperations() {
    console.log('👤 Testing Account Operations\n');

    const client = new LighterClient(URL, API_KEY, API_KEY_INDEX, ACCOUNT_INDEX);
    client.initialize();

    let nonce = Date.now();

    try {
        // Test 1: Withdraw Funds
        console.log('1. Creating Withdrawal...');
        const withdrawal = client.withdraw({
            amount: 1000000,
            nonce: nonce++
        });
        console.log('✅ Withdrawal:', JSON.parse(withdrawal).Sig.substring(0, 20) + '...\n');

        // Test 2: Transfer Funds
        console.log('2. Creating Transfer...');
        const transfer = client.transfer({
            toAccountIndex: parseInt(process.env.LIGHTER_TO_ACCOUNT || '67890'),
            amount: 5000000,
            fee: 1000,
            memo: '12345678901234567890123456789012',
            nonce: nonce++
        });
        console.log('✅ Transfer:', JSON.parse(transfer).Sig.substring(0, 20) + '...\n');

        // Test 3: Create Sub-Account
        console.log('3. Creating Sub-Account...');
        const subAccount = client.createSubAccount(nonce++);
        console.log('✅ Sub-Account:', JSON.parse(subAccount).Sig.substring(0, 20) + '...\n');

        // Test 4: Update Leverage (Cross Margin)
        console.log('4. Updating Leverage (Cross Margin)...');
        const leverageCross = client.updateLeverage({
            marketIndex: 60,
            fraction: 3000,
            marginMode: MARGIN_MODES.CROSS,
            nonce: nonce++
        });
        console.log('✅ Cross Leverage:', JSON.parse(leverageCross).Sig.substring(0, 20) + '...\n');

        // Test 5: Update Leverage (Isolated Margin)
        console.log('5. Updating Leverage (Isolated Margin)...');
        const leverageIsolated = client.updateLeverage({
            marketIndex: 61,
            fraction: 5000,
            marginMode: MARGIN_MODES.ISOLATED,
            nonce: nonce++
        });
        console.log('✅ Isolated Leverage:', JSON.parse(leverageIsolated).Sig.substring(0, 20) + '...\n');

        // Test 6: Change Public Key - use generated key format
        console.log('6. Changing Public Key...');
        const newApiKey = LighterClient.generateApiKey('new-key-seed');
        if (newApiKey.publicKey && !newApiKey.error) {
            const changePubKey = client.changePubKey(newApiKey.publicKey, nonce++);
            console.log('✅ Change Pub Key:', JSON.parse(changePubKey).Sig.substring(0, 20) + '...\n');
        } else {
            console.log('⚠️  Skipping Change Pub Key (API key generation failed)\n');
        }

        console.log('🎉 All account operations completed successfully!');

    } catch (error) {
        console.error('❌ Error in account operations:', error instanceof Error ? error.message : String(error));
    }
}

(async () => {
    await testAccountOperations();
})();
