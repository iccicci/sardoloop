import i18n from "i18next";
import { useEffect } from "react";
import { initReactI18next, useTranslation } from "react-i18next";

import en from "./locales/en";
import it from "./locales/it";

export type Language = "en" | "it";

type Paths<T> = T extends object ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${Paths<T[K]>}` : K) : never }[keyof T] : never;

type GetValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? GetValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

type ExtractInterpolationKeys<S extends string> = S extends `${string}{{${infer Var}}}${infer Rest}` ? Var | ExtractInterpolationKeys<Rest> : never;

type InterpolationMap<K extends string> = { [P in K]: string | number };

type TranslationOptions<T, K extends Paths<T>> =
  GetValue<T, K> extends string
    ? ExtractInterpolationKeys<GetValue<T, K>> extends never
      ? never
      : InterpolationMap<ExtractInterpolationKeys<GetValue<T, K>>>
    : never;

type TranslationSchema = typeof it;

type TranslationKey = Paths<TranslationSchema>;

type TFunction = {
  <K extends TranslationKey>(key: K): TranslationOptions<TranslationSchema, K> extends never ? string : never;
  <K extends TranslationKey>(key: K, options: TranslationOptions<TranslationSchema, K>): string;
};

export const enMissingKeysCheck: Paths<typeof en> = "" as TranslationKey;
export const enRedundantKeysCheck: TranslationKey = "" as Paths<typeof en>;
export const paramsCheck: TranslationOptions<typeof en, Paths<typeof en>> = {} as TranslationOptions<TranslationSchema, TranslationKey>;

i18n
  .use(initReactI18next)
  .init({
    fallbackLng:   "it",
    interpolation: { escapeValue: false },
    lng:           "it",
    resources:     { en: { translation: en }, it: { translation: it } }
  })
  // eslint-disable-next-line no-console
  .catch(error => console.error("While i18n init", error));

export const useLanguage = (lang: Language) => {
  const { t } = useTranslation();

  useEffect(() => {
    i18n
      .changeLanguage(lang)
      // eslint-disable-next-line no-console
      .catch(error => console.error("Setting language", error));
  }, [lang]);

  return { t } as unknown as { t: TFunction };
};
