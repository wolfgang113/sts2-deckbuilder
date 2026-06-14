"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ItemImageProps {
  src?: string;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
  placeholderClassName?: string;
}

export default function ItemImage({
  src,
  alt,
  fallback,
  className = "",
  placeholderClassName = "",
}: ItemImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-800/50 text-slate-500 ${placeholderClassName}`}
        title={alt}
      >
        {fallback ?? <ImageOff className="h-1/3 w-1/3 opacity-40" />}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {!loaded && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-slate-800/50 text-slate-500 ${placeholderClassName}`}
        >
          {fallback ?? <ImageOff className="h-1/3 w-1/3 opacity-40" />}
        </div>
      )}
    </div>
  );
}
