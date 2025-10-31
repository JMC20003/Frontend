const base = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

const satelite = "https://api.maptiler.com/maps/satellite/style.json?key=7E7fFAcuUoQg6PSA3UVF";

const open_street = `https://api.maptiler.com/maps/openstreetmap/style.json?key=${import.meta.env.VITE_API_KEY_OPEN_STREET}`;

const positron = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

import google_streets from "./map_styles/google_streets.json";

import google_satelite_hybrid from "./map_styles/google_satelite_hybrid.json";

export {
    base,
    satelite,
    open_street,
    positron,
    google_streets,
    google_satelite_hybrid,
}