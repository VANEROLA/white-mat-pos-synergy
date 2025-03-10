
export interface FreeItemReason {
  id: string;
  name: string;
}

export const DEFAULT_REASONS: FreeItemReason[] = [
  { id: "damaged", name: "商品の損傷" },
  { id: "customer_service", name: "顧客サービス" },
  { id: "promotion", name: "プロモーション" },
  { id: "employee", name: "従業員購入" },
  { id: "other", name: "その他" },
];

export const isDefaultReason = (id: string): boolean => 
  DEFAULT_REASONS.some(reason => reason.id === id);

export const loadSavedReasons = (): FreeItemReason[] => {
  try {
    const savedReasons = localStorage.getItem("freeItemReasons");
    if (savedReasons) {
      const parsedReasons = JSON.parse(savedReasons);
      if (Array.isArray(parsedReasons) && parsedReasons.length > 0) {
        return parsedReasons;
      }
    }
  } catch (error) {
    console.error("Failed to load free item reasons:", error);
  }
  return DEFAULT_REASONS;
};

export const saveReasons = (reasons: FreeItemReason[]): void => {
  localStorage.setItem("freeItemReasons", JSON.stringify(reasons));
};
