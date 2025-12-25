'use client';

import { Products } from "@/components/sections/products";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleContentUpdated = () => {
      setKey(prevKey => prevKey + 1);
    };

    window.addEventListener('content-updated', handleContentUpdated);

    return () => {
      window.removeEventListener('content-updated', handleContentUpdated);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex-1">
        <Products key={key} />
      </div>
    </div>
  );
}
