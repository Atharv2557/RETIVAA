/**
 * @file index.ts
 * @description Shared cross-feature type definitions.
 *
 * ARCHITECTURAL RULE:
 * Only place types here if they are shared across multiple top-level features or layout components.
 * Feature-specific data structures must remain inside `src/features/<feature-name>/types.ts`.
 */

import type { ReactNode } from "react";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: ReactNode;
}

export type ViewportDevice = "mobile" | "tablet" | "desktop";
