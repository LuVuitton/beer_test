export type Beer = {
    id:                number;
    name:              string;
    tagline:           string;
    first_brewed:      string;
    description:       string;
    image_url:         string;
    abv:               number;
    ibu:               number | null;
    target_fg:         number;
    target_og:         number;
    ebc:               number | null;
    srm:               number | null;
    ph:                number | null;
    attenuation_level: number;
    volume:            BoilVolume;
    boil_volume:       BoilVolume;
    method:            Method;
    ingredients:       Ingredients;
    food_pairing:      string[];
    brewers_tips:      string;
    contributed_by:    ContributedBy;
}

export type BoilVolume = {
    value: number;
    unit:  Unit;
}

export type Unit = "litres" | "grams" | "kilograms" | "celsius";

export type ContributedBy = "Sam Mason <samjbmason>" | "Ali Skinner <AliSkinner>";

export type Ingredients = {
    malt:  Malt[];
    hops:  Hop[];
    yeast: string;
}

export type Hop = {
    name:      string;
    amount:    BoilVolume;
    add:       Add;
    attribute: Attribute;
}

export type Add = "start" | "middle" | "end" | "dry hop";

export type Attribute = "bitter" | "flavour" | "aroma" | "Flavour";

export type Malt = {
    name:   string;
    amount: BoilVolume;
}

export type Method = {
    mash_temp:    MashTemp[];
    fermentation: Fermentation;
    twist:        null | string;
}

export type Fermentation = {
    temp: BoilVolume;
}

export type MashTemp = {
    temp:     BoilVolume;
    duration: number | null;
}