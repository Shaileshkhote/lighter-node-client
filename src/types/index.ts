// Core response types
export interface ApiKeyResponse {
    privateKey: string | null;
    publicKey: string | null;
    error: string | null;
}

export interface SignResult {
    signature: string | null;
    error: string | null;
}

// Order parameters
export interface CreateOrderParams {
    marketIndex: number;
    clientOrderIndex: number;
    baseAmount: number;
    price: number;
    isAsk: boolean;
    orderType: number;
    timeInForce: number;
    reduceOnly?: boolean;
    triggerPrice?: number;
    orderExpiry?: number;
    nonce: number;
}

export interface CancelOrderParams {
  marketIndex: number;
  orderIndex: number;
  nonce: number;
}

export interface ModifyOrderParams {
  marketIndex: number;
  orderIndex: number;
  baseAmount: number;
  price: number;
  triggerPrice: number;
  nonce: number;
}

export interface CancelAllOrdersParams {
  timeInForce: number;
  time: number;
  nonce: number;
}

export interface WithdrawParams {
  amount: number;
  nonce: number;
}

export interface TransferParams {
  toAccountIndex: number;
  amount: number;
  fee: number;
  memo: string;
  nonce: number;
}

export interface UpdateLeverageParams {
  marketIndex: number;
  fraction: number;
  marginMode: number;
  nonce: number;
}

export interface CreatePublicPoolParams {
  operatorFee: number;
  initialTotalShares: number;
  minOperatorShareRate: number;
  nonce: number;
}

export interface UpdatePublicPoolParams {
  publicPoolIndex: number;
  operatorFee: number;
  minOperatorShareRate: number;
  operatorShareRateMax: number;
  nonce: number;
}

export interface SharesParams {
  publicPoolIndex: number;
  shareAmount: number;
  nonce: number;
}

// Constants from Python implementation
export const ORDER_TYPES = {
    LIMIT: 0,
    MARKET: 1,
    STOP_LOSS: 2,
    STOP_LOSS_LIMIT: 3,
    TAKE_PROFIT: 4,
    TAKE_PROFIT_LIMIT: 5,
    TWAP: 6,
} as const;

export const TIME_IN_FORCE = {
    IMMEDIATE_OR_CANCEL: 0,
    GOOD_TILL_TIME: 1,
    POST_ONLY: 2,
} as const;

export const CANCEL_ALL_TIF = {
  IMMEDIATE: 0,
  SCHEDULED: 1,
  ABORT: 2,
} as const;

export const MARGIN_MODES = {
  CROSS: 0,
  ISOLATED: 1,
} as const;

export const CONSTANTS = {
  NIL_TRIGGER_PRICE: 0,
  DEFAULT_28_DAY_ORDER_EXPIRY: -1,
  DEFAULT_IOC_EXPIRY: 0,
  DEFAULT_10_MIN_AUTH_EXPIRY: -1,
  USDC_TICKER_SCALE: 1e6,
} as const;
