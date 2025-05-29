export const languages = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    hi: "Hindi",
    ru: "Russian",
    pt: "Portuguese",
    nl: "Dutch",
    tl: "Tagalog",
    tr: "Turkish",
    pl: "Polish",
    ar: "Arabic",
    // Additional languages
    af: "Afrikaans",
    am: "Amharic",
    bg: "Bulgarian",
    bn: "Bengali",
    cs: "Czech",
    da: "Danish",
    el: "Greek",
    fa: "Persian",
    fi: "Finnish",
    he: "Hebrew",
    hr: "Croatian",
    hu: "Hungarian",
    id: "Indonesian",
    ms: "Malay",
    no: "Norwegian",
    ro: "Romanian",
    sk: "Slovak",
    sl: "Slovenian",
    sv: "Swedish",
    th: "Thai",
    uk: "Ukrainian",
    ur: "Urdu",
    vi: "Vietnamese"
} as const;

type LanguageCode = keyof typeof languages;

export const getLanguageName = (code: string): string => {
    return languages[code.toLowerCase() as LanguageCode] || code.toUpperCase();
};