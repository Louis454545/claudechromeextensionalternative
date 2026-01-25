import {
  connect,
  ExtensionTransport,
} from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";

// Define our own AccessibilityNode type to avoid conflicts with Puppeteer's internal types
export interface AccessibilityNode {
  role?: string;
  name?: string;
  value?: string;
  description?: string;
  keyshortcuts?: string;
  roledescription?: string;
  valuetext?: string;
  disabled?: boolean;
  expanded?: boolean;
  focused?: boolean;
  modal?: boolean;
  multiline?: boolean;
  multiselectable?: boolean;
  readonly?: boolean;
  required?: boolean;
  selected?: boolean;
  checked?: boolean | "mixed";
  pressed?: boolean | "mixed";
  level?: number;
  valuemin?: number;
  valuemax?: number;
  autocomplete?: string;
  haspopup?: string;
  invalid?: string;
  orientation?: string;
  children?: AccessibilityNode[];
}

export async function fetchAccessibilityTree(
  tabId: number
): Promise<AccessibilityNode | null> {
  const browser = await connect({
    transport: await ExtensionTransport.connectTab(tabId),
  });

  try {
    const [page] = await browser.pages();
    if (!page) {
      return null;
    }

    const snapshot = await page.accessibility.snapshot({
      interestingOnly: false,
    });

    return snapshot as AccessibilityNode | null;
  } finally {
    browser.disconnect();
  }
}

export function flattenAccessibilityTree(
  node: AccessibilityNode | null,
  depth = 0
): Array<{ node: AccessibilityNode; depth: number }> {
  if (!node) return [];

  const result: Array<{ node: AccessibilityNode; depth: number }> = [
    { node, depth },
  ];

  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenAccessibilityTree(child, depth + 1));
    }
  }

  return result;
}
