"use client";

import type { Configuration } from "app/services/tmdb";
import React, { createContext, useContext } from "react";

const ConfigContext = createContext<Configuration | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  configuration: Configuration;
};

export function TmdbConfigProvider({ children, configuration }: ProviderProps) {
  return (
    <ConfigContext.Provider value={configuration}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useImageUrl() {
  const config = useContext(ConfigContext);

  return (path: string): string => {
    if (!config) throw new Error("Image config not available");

    const {
      images: { secure_base_url: baseUrl, profile_sizes: sizes },
    } = config;

    const size = sizes.reduce((sizeA, sizeB) => {
      const sizeAInt = parseInt(sizeA.replace(/\D/g, ""), 10);
      const sizeBInt = parseInt(sizeB.replace(/\D/g, ""), 10);

      if (isNaN(sizeAInt)) return sizeB;
      if (isNaN(sizeBInt)) return sizeA;

      return sizeAInt > sizeBInt ? sizeA : sizeB;
    });

    return `${baseUrl}${size}${path}`;
  };
}
