
import * as icons from "lucide-react";

export const iconMap = icons;

// We are omitting a few icons that are not suitable for UI selection
const excludedIcons = [
  'default',
  'createLucideIcon',
  'icons',
  'LucideIcon',
  'LucideProps',
  'IconNode',
  'toPascalCase',
];

export const iconNames = Object.keys(icons)
  .filter(name => !excludedIcons.includes(name) && /^[A-Z]/.test(name))
  .sort();

export type LucideIconName = keyof typeof iconMap;
