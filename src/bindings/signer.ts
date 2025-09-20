import * as koffi from 'koffi';
import { ApiKeyResponse, SignResult } from '../types';
import { PlatformDetector } from '../utils';

// C struct definitions
const ApiKeyResponseStruct = koffi.struct('ApiKeyResponse', {
    privateKey: 'char*',
    publicKey: 'char*',
    err: 'char*',
});

const StrOrErrStruct = koffi.struct('StrOrErr', {
    str: 'char*',
    err: 'char*',
});

export class LighterSigner {
    private lib: any;
    private functions: { [key: string]: any } = {};

    constructor() {
        this.loadLibrary();
    }

  private loadLibrary(): void {
    const platformInfo = PlatformDetector.detectPlatform();
    
    if (!PlatformDetector.validateBinaryExists()) {
      throw new Error(`Signer binary not found at: ${platformInfo.libraryPath}`);
    }
    
    try {
      this.lib = koffi.load(platformInfo.libraryPath);
      this.bindFunctions();
    } catch (error) {
      throw new Error(`Failed to load signer library at ${platformInfo.libraryPath}: ${error}`);
    }
  }

    private bindFunctions(): void {
        this.functions = {
            // API Key Management
            GenerateAPIKey: this.lib.func('GenerateAPIKey', ApiKeyResponseStruct, ['str']),

            // Client Management
            CreateClient: this.lib.func('CreateClient', 'str', ['str', 'str', 'int', 'int', 'int64']),
            CheckClient: this.lib.func('CheckClient', 'str', ['str', 'int64']),
            SwitchAPIKey: this.lib.func('SwitchAPIKey', 'str', ['int']),

            // Order Operations
            SignCreateOrder: this.lib.func('SignCreateOrder', StrOrErrStruct, [
                'int',    // market_index
                'int64',  // client_order_index
                'int64',  // base_amount
                'int',    // price
                'int',    // is_ask
                'int',    // order_type
                'int',    // time_in_force
                'int',    // reduce_only
                'int',    // trigger_price
                'int64',  // order_expiry
                'int64'   // nonce
            ]),
            SignCancelOrder: this.lib.func('SignCancelOrder', StrOrErrStruct, ['int', 'int64', 'int64']),
            SignModifyOrder: this.lib.func('SignModifyOrder', StrOrErrStruct, [
                'int', 'int64', 'int64', 'int64', 'int64', 'int64'
            ]),
            SignCancelAllOrders: this.lib.func('SignCancelAllOrders', StrOrErrStruct, ['int', 'int64', 'int64']),

            // Account Operations
            SignWithdraw: this.lib.func('SignWithdraw', StrOrErrStruct, ['int64', 'int64']),
            SignTransfer: this.lib.func('SignTransfer', StrOrErrStruct, ['int64', 'int64', 'int64', 'str', 'int64']),
            SignCreateSubAccount: this.lib.func('SignCreateSubAccount', StrOrErrStruct, ['int64']),
            SignChangePubKey: this.lib.func('SignChangePubKey', StrOrErrStruct, ['str', 'int64']),

            // Leverage and Pool Operations
            SignUpdateLeverage: this.lib.func('SignUpdateLeverage', StrOrErrStruct, ['int', 'int64', 'int', 'int64']),
            SignCreatePublicPool: this.lib.func('SignCreatePublicPool', StrOrErrStruct, ['int64', 'int64', 'int64', 'int64']),
            SignUpdatePublicPool: this.lib.func('SignUpdatePublicPool', StrOrErrStruct, ['int', 'int64', 'int64', 'int64', 'int64']),
            SignMintShares: this.lib.func('SignMintShares', StrOrErrStruct, ['int', 'int64', 'int64']),
            SignBurnShares: this.lib.func('SignBurnShares', StrOrErrStruct, ['int', 'int64', 'int64']),

            // Authentication
            CreateAuthToken: this.lib.func('CreateAuthToken', StrOrErrStruct, ['int64']),
        };
    }

    generateApiKey(seed: string = ''): ApiKeyResponse {
        const result = this.functions.GenerateAPIKey(seed);
        return {
            privateKey: result.privateKey || null,
            publicKey: result.publicKey || null,
            error: result.err || null,
        };
    }

    createClient(url: string, apiKey: string, chainId: number, apiKeyIndex: number, accountIndex: number): string | null {
        const result = this.functions.CreateClient(url, apiKey, chainId, apiKeyIndex, accountIndex);
        return result || null;
    }

    signCreateOrder(
        marketIndex: number,
        clientOrderIndex: number,
        baseAmount: number,
        price: number,
        isAsk: number,
        orderType: number,
        timeInForce: number,
        reduceOnly: number,
        triggerPrice: number,
        orderExpiry: number,
        nonce: number
    ): SignResult {
        const result = this.functions.SignCreateOrder(
            marketIndex, clientOrderIndex, baseAmount, price, isAsk,
            orderType, timeInForce, reduceOnly, triggerPrice, orderExpiry, nonce
        );
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signCancelOrder(marketIndex: number, orderIndex: number, nonce: number): SignResult {
        const result = this.functions.SignCancelOrder(marketIndex, orderIndex, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    checkClient(apiKey: string, accountIndex: number): string | null {
        const result = this.functions.CheckClient(apiKey, accountIndex);
        return result || null;
    }

    switchApiKey(apiKeyIndex: number): string | null {
        const result = this.functions.SwitchAPIKey(apiKeyIndex);
        return result || null;
    }

    signModifyOrder(
        marketIndex: number,
        orderIndex: number,
        baseAmount: number,
        price: number,
        triggerPrice: number,
        nonce: number
    ): SignResult {
        const result = this.functions.SignModifyOrder(
            marketIndex, orderIndex, baseAmount, price, triggerPrice, nonce
        );
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signCancelAllOrders(timeInForce: number, time: number, nonce: number): SignResult {
        const result = this.functions.SignCancelAllOrders(timeInForce, time, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signWithdraw(amount: number, nonce: number): SignResult {
        const result = this.functions.SignWithdraw(amount, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signTransfer(
        toAccountIndex: number,
        amount: number,
        fee: number,
        memo: string,
        nonce: number
    ): SignResult {
        const result = this.functions.SignTransfer(toAccountIndex, amount, fee, memo, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signCreateSubAccount(nonce: number): SignResult {
        const result = this.functions.SignCreateSubAccount(nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signChangePubKey(newPubkey: string, nonce: number): SignResult {
        const result = this.functions.SignChangePubKey(newPubkey, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signUpdateLeverage(
        marketIndex: number,
        fraction: number,
        marginMode: number,
        nonce: number
    ): SignResult {
        const result = this.functions.SignUpdateLeverage(marketIndex, fraction, marginMode, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signCreatePublicPool(
        operatorFee: number,
        initialTotalShares: number,
        minOperatorShareRate: number,
        nonce: number
    ): SignResult {
        const result = this.functions.SignCreatePublicPool(
            operatorFee, initialTotalShares, minOperatorShareRate, nonce
        );
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signUpdatePublicPool(
        publicPoolIndex: number,
        operatorFee: number,
        minOperatorShareRate: number,
        operatorShareRateMax: number,
        nonce: number
    ): SignResult {
        const result = this.functions.SignUpdatePublicPool(
            publicPoolIndex, operatorFee, minOperatorShareRate, operatorShareRateMax, nonce
        );
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signMintShares(publicPoolIndex: number, shareAmount: number, nonce: number): SignResult {
        const result = this.functions.SignMintShares(publicPoolIndex, shareAmount, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    signBurnShares(publicPoolIndex: number, shareAmount: number, nonce: number): SignResult {
        const result = this.functions.SignBurnShares(publicPoolIndex, shareAmount, nonce);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }

    createAuthToken(deadline: number): SignResult {
        const result = this.functions.CreateAuthToken(deadline);
        return {
            signature: result.str || null,
            error: result.err || null,
        };
    }
}
