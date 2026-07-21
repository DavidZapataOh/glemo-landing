"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import Link from "next/link";
import "./reference.css";

const specUrl = process.env.NEXT_PUBLIC_OPENAPI_URL ?? "/openapi.json";

/**
 * Interactive reference with Glemo's identity: theme "none" + our own
 * --scalar-* variables (reference.css), Satoshi/JetBrains typography, a branded
 * top bar with a link back to the docs, and no foreign chrome.
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
