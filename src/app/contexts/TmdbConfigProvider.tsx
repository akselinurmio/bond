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

  return (path: string, targetWidth: number): string => {
    if (!config) throw new Error("Image config not available");

    const {
      images: { secure_base_url: baseUrl, profile_sizes: sizes },
    } = config;

    const width = sizes
      .reduce((widths: number[], size: string): number[] => {
        const match = /^w(\d+)$/.exec(size);
        if (match && match[1]) widths.push(parseInt(match[1]));
        return widths;
      }, [])
      .reduce((widthA, widthB) =>
        Math.abs(widthB - targetWidth) < Math.abs(widthA - targetWidth)
          ? widthB
          : widthA,
      );

    return `${baseUrl}w${width}${path}`;
  };
}
