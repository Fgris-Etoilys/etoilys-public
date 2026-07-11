export type TextTranslations = Readonly<Record<string, string>>;

export function translateText(value: string, translations: TextTranslations): string {
  const exactTranslation = translations[value];
  if (exactTranslation !== undefined) {
    return exactTranslation;
  }

  return Object.entries(translations).reduce(
    (translated, [source, target]) => translated.split(source).join(target),
    value
  );
}
