"use client";

import { useEffect, useState } from "react";

export default function VisitCounter({ id }: { id: number }) {
  const [visits, setVisits] = useState(0);
  useEffect(() => {
    const k = `visits-${id}`;
    const v = parseInt(localStorage.getItem(k) || '0', 10) || 0;
    localStorage.setItem(k, String(v + 1));
    setVisits(v + 1);
  }, [id]);
  return <span className="text-xs text-gray-500">{visits} visitas</span>;
}

