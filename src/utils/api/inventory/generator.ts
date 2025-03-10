
/**
 * 一意の注文IDを生成する
 */
export const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
