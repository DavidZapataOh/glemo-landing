"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import Link from "next/link";
import "./reference.css";

const specUrl = process.env.NEXT_PUBLIC_OPENAPI_URL ?? "/openapi.json";

/**
 * Referencia interactiva con la identidad de Glemo: theme "none" + variables
 * --scalar-* propias (reference.css), tipografía Satoshi/JetBrains, top bar
 * de marca con vuelta a las docs, y sin chrome ajeno.
 */
export default function ApiReferencePage() {
  return (
    <div className="glemo-reference">
      <header className="glemo-reference-bar">
        <span className="glemo-reference-brand">Glemo</span>
        <span className="glemo-reference-title">API reference</span>
        <Link href="/docs" className="glemo-reference-back">
          ← Docs
        </Link>
      </header>
      <ApiReferenceReact
        configuration={{
          url: specUrl,
          theme: "none",
          darkMode: true,
          hideDarkModeToggle: true,
          hideClientButton: true,
          withDefaultFonts: false,
        }}
      />
    </div>
  );
}
