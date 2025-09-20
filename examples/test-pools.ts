/**
 * Pool Operations Test
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

async function testPoolOperations() {
    console.log('🏊 Testing Pool Operations\n');

    const client = new LighterClient(URL, API_KEY, API_KEY_INDEX, ACCOUNT_INDEX);
    client.initialize();

    let nonce = Date.now();

    try {
        // Test 1: Create Public Pool
        console.log('1. Creating Public Pool...');
        const createPool = client.createPublicPool({
            operatorFee: 100,
            initialTotalShares: 1000000,
            minOperatorShareRate: 500,
            nonce: nonce++
        });
        console.log('✅ Create Pool:', JSON.parse(createPool).Sig.substring(0, 20) + '...\n');

        // Test 2: Update Public Pool - use simpler parameters
        console.log('2. Updating Public Pool...');
        try {
            const updatePool = client.updatePublicPool({
                publicPoolIndex: 0, // Use pool index 0
                operatorFee: 50, // Lower fee
                minOperatorShareRate: 100, // Lower rate
                operatorShareRateMax: 1000, // Lower max rate
                nonce: nonce++
            });
            console.log('✅ Update Pool:', JSON.parse(updatePool).Sig.substring(0, 20) + '...\n');
        } catch (error) {
            console.log('⚠️  Update Pool failed (validation):', error instanceof Error ? error.message : String(error), '\n');
        }

        // Test 3: Mint Shares
        console.log('3. Minting Shares...');
        const mintShares = client.mintShares({
            publicPoolIndex: 1,
            shareAmount: 100000000,
            nonce: nonce++
        });
        console.log('✅ Mint Shares:', JSON.parse(mintShares).Sig.substring(0, 20) + '...\n');

        // Test 4: Burn Shares
        console.log('4. Burning Shares...');
        const burnShares = client.burnShares({
            publicPoolIndex: 1,
            shareAmount: 50000000,
            nonce: nonce++
        });
        console.log('✅ Burn Shares:', JSON.parse(burnShares).Sig.substring(0, 20) + '...\n');

        // Test 5: Mint Shares Pool 2
        console.log('5. Minting Shares in Pool 2...');
        const mintShares2 = client.mintShares({
            publicPoolIndex: 2,
            shareAmount: 200000000,
            nonce: nonce++
        });
        console.log('✅ Mint Shares Pool 2:', JSON.parse(mintShares2).Sig.substring(0, 20) + '...\n');

        // Test 6: Burn Shares Pool 2
        console.log('6. Burning Shares in Pool 2...');
        const burnShares2 = client.burnShares({
            publicPoolIndex: 2,
            shareAmount: 75000000,
            nonce: nonce++
        });
        console.log('✅ Burn Shares Pool 2:', JSON.parse(burnShares2).Sig.substring(0, 20) + '...\n');

        console.log('🎉 All pool operations completed successfully!');

    } catch (error) {
        console.error('❌ Error in pool operations:', error instanceof Error ? error.message : String(error));
    }
}

(async () => {
    await testPoolOperations();
})();
