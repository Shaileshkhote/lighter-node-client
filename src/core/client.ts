import { LighterSigner } from '../bindings';
import { 
  CreateOrderParams, 
  CancelOrderParams, 
  ModifyOrderParams,
  CancelAllOrdersParams,
  WithdrawParams,
  TransferParams,
  UpdateLeverageParams,
  CreatePublicPoolParams,
  UpdatePublicPoolParams,
  SharesParams,
  SignResult, 
  CONSTANTS 
} from '../types';

export class LighterClient {
    private signer: LighterSigner;
    private url: string;
    private privateKey: string;
    private chainId: number;
    private apiKeyIndex: number;
    private accountIndex: number;

    constructor(
        url: string,
        privateKey: string,
        apiKeyIndex: number,
        accountIndex: number
    ) {
        this.url = url;
        this.privateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
        this.chainId = url.includes('mainnet') ? 304 : 300;
        this.apiKeyIndex = apiKeyIndex;
        this.accountIndex = accountIndex;
        this.signer = new LighterSigner();
    }

    initialize(): void {
        const error = this.signer.createClient(
            this.url,
            this.privateKey,
            this.chainId,
            this.apiKeyIndex,
            this.accountIndex
        );

        if (error) {
            throw new Error(`Failed to initialize client: ${error}`);
        }
    }

    createOrder(params: CreateOrderParams): string {
        const result = this.signer.signCreateOrder(
            params.marketIndex,
            params.clientOrderIndex,
            params.baseAmount,
            params.price,
            params.isAsk ? 1 : 0,
            params.orderType,
            params.timeInForce,
            params.reduceOnly ? 1 : 0,
            params.triggerPrice || CONSTANTS.NIL_TRIGGER_PRICE,
            params.orderExpiry !== undefined ? params.orderExpiry : 0,
            params.nonce
        );

        if (result.error) {
            throw new Error(`Failed to sign order: ${result.error}`);
        }

        return result.signature!;
    }

    cancelOrder(params: CancelOrderParams): string {
        const result = this.signer.signCancelOrder(
            params.marketIndex,
            params.orderIndex,
            params.nonce
        );

        if (result.error) {
            throw new Error(`Failed to sign cancel order: ${result.error}`);
        }

        return result.signature!;
    }

    createAuthToken(deadline?: number): string {
        const authDeadline = deadline || (Math.floor(Date.now() / 1000) + 600); // 10 minutes default
        const result = this.signer.createAuthToken(authDeadline);

        if (result.error) {
            throw new Error(`Failed to create auth token: ${result.error}`);
        }

        return result.signature!;
    }

  modifyOrder(params: ModifyOrderParams): string {
    const result = this.signer.signModifyOrder(
      params.marketIndex,
      params.orderIndex,
      params.baseAmount,
      params.price,
      params.triggerPrice,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign modify order: ${result.error}`);
    }

    return result.signature!;
  }

  cancelAllOrders(params: CancelAllOrdersParams): string {
    const result = this.signer.signCancelAllOrders(
      params.timeInForce,
      params.time,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign cancel all orders: ${result.error}`);
    }

    return result.signature!;
  }

  withdraw(params: WithdrawParams): string {
    const result = this.signer.signWithdraw(params.amount, params.nonce);

    if (result.error) {
      throw new Error(`Failed to sign withdrawal: ${result.error}`);
    }

    return result.signature!;
  }

  transfer(params: TransferParams): string {
    const result = this.signer.signTransfer(
      params.toAccountIndex,
      params.amount,
      params.fee,
      params.memo,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign transfer: ${result.error}`);
    }

    return result.signature!;
  }

  createSubAccount(nonce: number): string {
    const result = this.signer.signCreateSubAccount(nonce);

    if (result.error) {
      throw new Error(`Failed to sign create sub account: ${result.error}`);
    }

    return result.signature!;
  }

  changePubKey(newPubkey: string, nonce: number): string {
    const result = this.signer.signChangePubKey(newPubkey, nonce);

    if (result.error) {
      throw new Error(`Failed to sign change pub key: ${result.error}`);
    }

    return result.signature!;
  }

  updateLeverage(params: UpdateLeverageParams): string {
    const result = this.signer.signUpdateLeverage(
      params.marketIndex,
      params.fraction,
      params.marginMode,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign update leverage: ${result.error}`);
    }

    return result.signature!;
  }

  createPublicPool(params: CreatePublicPoolParams): string {
    const result = this.signer.signCreatePublicPool(
      params.operatorFee,
      params.initialTotalShares,
      params.minOperatorShareRate,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign create public pool: ${result.error}`);
    }

    return result.signature!;
  }

  updatePublicPool(params: UpdatePublicPoolParams): string {
    const result = this.signer.signUpdatePublicPool(
      params.publicPoolIndex,
      params.operatorFee,
      params.minOperatorShareRate,
      params.operatorShareRateMax,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign update public pool: ${result.error}`);
    }

    return result.signature!;
  }

  mintShares(params: SharesParams): string {
    const result = this.signer.signMintShares(
      params.publicPoolIndex,
      params.shareAmount,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign mint shares: ${result.error}`);
    }

    return result.signature!;
  }

  burnShares(params: SharesParams): string {
    const result = this.signer.signBurnShares(
      params.publicPoolIndex,
      params.shareAmount,
      params.nonce
    );

    if (result.error) {
      throw new Error(`Failed to sign burn shares: ${result.error}`);
    }

    return result.signature!;
  }

  checkClient(): void {
    const error = this.signer.checkClient(this.privateKey, this.accountIndex);
    if (error) {
      throw new Error(`Client check failed: ${error}`);
    }
    console.log('Client check passed');
  }

  switchApiKey(apiKeyIndex: number): void {
    const error = this.signer.switchApiKey(apiKeyIndex);
    if (error) {
      throw new Error(`Failed to switch API key: ${error}`);
    }
  }

  static generateApiKey(seed: string = '') {
    const signer = new LighterSigner();
    return signer.generateApiKey(seed);
  }
}
