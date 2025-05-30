
import React, { createContext, useContext, useState, useEffect } from 'react';

interface TaxContextType {
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

const defaultTaxRate = 10; // Default 10%

const TaxContext = createContext<TaxContextType>({
  taxRate: defaultTaxRate,
  setTaxRate: () => {},
});

export const useTax = () => useContext(TaxContext);

export const TaxProvider = ({ children }: { children: React.ReactNode }) => {
  const [taxRate, setTaxRateState] = useState<number>(() => {
    // Try to get the tax rate from local storage
    const savedTaxRate = localStorage.getItem('taxRate');
    return savedTaxRate ? Number(savedTaxRate) : defaultTaxRate;
  });

  const setTaxRate = (rate: number) => {
    setTaxRateState(rate);
    localStorage.setItem('taxRate', rate.toString());
  };

  // Ensure the tax rate is saved to localStorage when changed
  useEffect(() => {
    localStorage.setItem('taxRate', taxRate.toString());
  }, [taxRate]);

  return (
    <TaxContext.Provider value={{ taxRate, setTaxRate }}>
      {children}
    </TaxContext.Provider>
  );
};
