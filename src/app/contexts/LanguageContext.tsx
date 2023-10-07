"use client";

import React, { createContext, useContext } from "react";

const LanguageContext = createContext("fi");

type ProviderProps = {
  children: React.ReactNode;
  language: string;
};

export function LanguageProvider({ children, language }: ProviderProps) {
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
