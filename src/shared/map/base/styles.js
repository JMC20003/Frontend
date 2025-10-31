import { base, satelite, open_street, positron, google_streets, google_satelite_hybrid } from './sources'

import mapa_base from './map_styles/preview/mapa_base.png'
import satelitePng  from './map_styles/preview/satelite.png';
import openstree from './map_styles/preview/openstreet.png'
import sin_etiqueta from './map_styles/preview/sin_etiqueta.png'
import google from './map_styles/preview/google_streets.png'
import googleSatelite from './map_styles/preview/google_satelite.png'
export const mapStyles = [  
    {
        id: 'map_base',
        label: 'Mapa base', 
        source: base,
        preview: mapa_base,      
    },
    {
        id: 'map_satelite',
        label: 'Satelite', 
        source: satelite,
        preview: satelitePng,      
    },
    {
        id: 'map_open_street',
        label: 'Open Street', 
        source: open_street,
        preview: openstree,      
    },
    {
        id: 'map_positron',
        label: 'Sin etiquetas', 
        source: positron,
        preview: sin_etiqueta,      
    },
    {
        id: 'map_google_streets',
        label: 'G. Streets', 
        source: google_streets,
        preview: google,      
    },
    {
        id: 'map_google_satelite',
        label: 'G. Satelite', 
        source: google_satelite_hybrid ,
        preview: googleSatelite,      
    },
];