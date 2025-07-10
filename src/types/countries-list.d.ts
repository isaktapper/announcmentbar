declare module 'countries-list' {
  interface CountryData {
    name: string
    native: string
    phone: string
    continent: string
    capital: string
    currency: string
    languages: string[]
    emoji: string
    emojiU: string
  }

  interface CountriesList {
    [key: string]: CountryData
  }

  export const countries: CountriesList
  export const continents: { [key: string]: string }
  export const languages: { [key: string]: string }
} 