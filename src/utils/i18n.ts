import en from "../langs/en.json"
import th from "../langs/th.json"

export type Language = {
    key: string;
    flag: string;
    name: string;
    locate: string;
    data: typeof en;
}

export const languages: Language[] = [
    {
        key: "en",
        flag: en.flag,
        name: en.name,
        locate: en.locate,
        data: en
    },
    {
        key: "th",
        flag: th.flag,
        name: th.name,
        locate: th.locate,
        data: parseLanguageData(th)
    }
]

export function parseLanguageData(data: object): typeof en {
    const parsed = {
        ...en,
        ...data
    }
    return parsed;
}

export function getLanguageByKey(key: string): Language | undefined {
    return languages.find(lang => lang.key === key)
}