/**
 * Order Operations Test
 */

import {
    LighterClient,
    ORDER_TYPES,
    TIME_IN_FORCE,
    CANCEL_ALL_TIF
} from '../src';

import process from 'process';

const API_KEY = process.env.LIGHTER_PRIVATE_KEY;

if (!API_KEY) {
    console.error('❌ Error: LIGHTER_PRIVATE_KEY environment variable is required');
    process.exit(1);
}
const URL = process.env.LIGHTER_API_URL || 'https://testnet.zklighter.elliot.ai';
const API_KEY_INDEX = parseInt(process.env.LIGHTER_API_KEY_INDEX || '0', 10);
const ACCOUNT_INDEX = parseInt(process.env.LIGHTER_ACCOUNT_INDEX || '12345', 10);
const MARKET_INDEX = parseInt(process.env.LIGHTER_MARKET_INDEX || '0', 10);

async function testOrderOperations() {
    console.log('📋 Testing Order Operations\n');

    const client = new LighterClient(URL, API_KEY, API_KEY_INDEX, ACCOUNT_INDEX);
    client.initialize();

    let nonce = Date.now();

    try {
        // Test 1: Create Market Order
        console.log('1. Creating Market Order...');
        const marketOrder = client.createOrder({
            marketIndex: MARKET_INDEX,
            clientOrderIndex: nonce++,
            baseAmount: 100,
            price: 50000,
            isAsk: false,
            orderType: ORDER_TYPES.MARKET,
            timeInForce: TIME_IN_FORCE.IMMEDIATE_OR_CANCEL,
            orderExpiry: 0,
            nonce: nonce++
        });
        console.log('✅ Market Order:', JSON.parse(marketOrder).Sig.substring(0, 20) + '...\n');

        // Test 2: Create Limit Order
        console.log('2. Creating Limit Order...');
        const limitOrder = client.createOrder({
            marketIndex: MARKET_INDEX,
            clientOrderIndex: nonce++,
            baseAmount: 50,
            price: 210000,
            isAsk: true,
            orderType: ORDER_TYPES.LIMIT,
            timeInForce: TIME_IN_FORCE.GOOD_TILL_TIME,
            orderExpiry: -1,
            nonce: nonce++
        });
        console.log('✅ Limit Order:', JSON.parse(limitOrder).Sig.substring(0, 20) + '...\n');

        // Test 3: Create Post-Only Order
        console.log('3. Creating Post-Only Order...');
        const postOnlyOrder = client.createOrder({
            marketIndex: MARKET_INDEX,
            clientOrderIndex: nonce++,
            baseAmount: 75,
            price: 215000,
            isAsk: true,
            orderType: ORDER_TYPES.LIMIT,
            timeInForce: TIME_IN_FORCE.POST_ONLY,
            orderExpiry: -1,
            nonce: nonce++
        });
        console.log('✅ Post-Only Order:', JSON.parse(postOnlyOrder).Sig.substring(0, 20) + '...\n');

        // Test 3b: Try Stop Loss Order with correct parameters
        console.log('3b. Attempting Stop Loss Order...');
        try {
            const stopLossOrder = client.createOrder({
                marketIndex: MARKET_INDEX,
                clientOrderIndex: nonce++,
                baseAmount: 50,
                price: 200000,
                isAsk: true,
                orderType: ORDER_TYPES.STOP_LOSS,
                timeInForce: TIME_IN_FORCE.IMMEDIATE_OR_CANCEL,
                triggerPrice: 205000,
                orderExpiry: 0,
                nonce: nonce++
            });
            console.log('✅ Stop Loss Order:', JSON.parse(stopLossOrder).Sig.substring(0, 20) + '...\n');
        } catch (error) {
            console.log('⚠️  Stop Loss failed (validation):', error instanceof Error ? error.message : String(error), '\n');
        }

        // Test 4: Modify Order
        console.log('4. Modifying Order...');
        const modifyOrder = client.modifyOrder({
            marketIndex: MARKET_INDEX,
            orderIndex: 281474976710656,
            baseAmount: 150,
            price: 215000,
            triggerPrice: 0,
            nonce: nonce++
        });
        console.log('✅ Modified Order:', JSON.parse(modifyOrder).Sig.substring(0, 20) + '...\n');

        // Test 5: Cancel Specific Order
        console.log('5. Canceling Specific Order...');
        const cancelOrder = client.cancelOrder({
            marketIndex: MARKET_INDEX,
            orderIndex: 281474976710656,
            nonce: nonce++
        });
        console.log('✅ Cancel Order:', JSON.parse(cancelOrder).Sig.substring(0, 20) + '...\n');

        // Test 6: Cancel All Orders
        console.log('6. Canceling All Orders...');
        const cancelAllOrders = client.cancelAllOrders({
            timeInForce: CANCEL_ALL_TIF.IMMEDIATE,
            time: 0, // Use 0 for immediate cancellation
            nonce: nonce++
        });
        console.log('✅ Cancel All Orders:', JSON.parse(cancelAllOrders).Sig.substring(0, 20) + '...\n');

        console.log('🎉 All order operations completed successfully!');

    } catch (error) {
        console.error('❌ Error in order operations:', error instanceof Error ? error.message : String(error));
    }
}

(async () => {
    await testOrderOperations();
})();
