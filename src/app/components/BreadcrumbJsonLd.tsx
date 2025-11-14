"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const baseUrl = "https://hospelia.co";

function toName(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BreadcrumbJsonLd() {
  const pathname = usePathname() || "/";

  const parts = pathname.split("/").filter(Boolean);
  const items = [] as Array<any>;
  let acc = "";

  parts.forEach((seg, i) => {
    acc += `/${seg}`;
    items.push({
      "@type": "ListItem",
      position: i + 1,
      name: toName(seg),
      item: `${baseUrl}${acc}`,
    });
  });

  if (items.length === 0) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };

  return (
    <Script
      id="schema-breadcrumbs"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

