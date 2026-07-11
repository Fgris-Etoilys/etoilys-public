import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { Locale } from './locales';
import { translateText, type TextTranslations } from './textTranslation';

interface LocalizedContentProps {
  locale: Locale;
  translations: TextTranslations;
  children: ReactNode;
}

const TRANSLATABLE_PROPS = new Set([
  'aria-label',
  'caption',
  'helperText',
  'label',
  'placeholder',
  'srLabel',
  'title',
]);

function localizeNode(node: ReactNode, translations: TextTranslations): ReactNode {
  if (typeof node === 'string') {
    return translateText(node, translations);
  }

  if (Array.isArray(node)) {
    return Children.map(node, (child) => localizeNode(child, translations));
  }

  if (!isValidElement(node)) {
    return node;
  }

  const element = node as ReactElement<Record<string, unknown>>;
  const nextProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(element.props)) {
    if (key === 'children') {
      nextProps.children = Children.map(value as ReactNode, (child) =>
        localizeNode(child, translations)
      );
    } else if (TRANSLATABLE_PROPS.has(key) && typeof value === 'string') {
      nextProps[key] = translateText(value, translations);
    }
  }

  return cloneElement(element, nextProps);
}

export default function LocalizedContent({
  locale,
  translations,
  children,
}: LocalizedContentProps) {
  return locale === 'fr' ? children : localizeNode(children, translations);
}
