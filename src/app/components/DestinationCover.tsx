"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function DestinationCover({ slug, title }: { slug: string; title: string }) {
  const [src, setSrc] = useState<string>("/zona-default.jpg");

  useEffect(() => {
    let mounted = true;
    const key = `dest-cover-${slug}`;
    const cached = sessionStorage.getItem(key);
    if (cached) setSrc(cached);
    fetch(`/api/destinos/cover?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => {
        if (!mounted) return;
        if (d?.imageUrl) {
          setSrc(d.imageUrl);
          try { sessionStorage.setItem(key, d.imageUrl); } catch {}
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [slug]);

  return (
    <Image src={src} alt={title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 768px) 100vw, 25vw" />
  );
}

