import explorar from "@/shared/assets/svg/tab_map/explorar.svg";
import mundo from "@/shared/assets/svg/tab_map/fullscreen.svg";
import acercarSeleccion from "@/shared/assets/svg/tab_map/zoom-selection.svg";
import acercar from "@/shared/assets/svg/tab_map/zoom-in-alt.svg";
import alejar from "@/shared/assets/svg/tab_map/zoom-out-alt.svg";
// import anterior from "@/shared/assets/svg/tab_map/anterior.png";
// import siguiente from "@/shared/assets/svg/tab_map/siguiente.png";
import marcadores from "@/shared/assets/svg/tab_map/marcadores.svg";
import irA from "@/shared/assets/svg/tab_map/Ir_a.svg";

import mapaBase from "@/shared/assets/svg/tab_map/mapas_base.svg";
import agregarDatos from "@/shared/assets/svg/tab_map/agregar_datos.svg";
// import kml from "@/shared/assets/svg/tab_map/kml.png";
// import geojson from "@/shared/assets/svg/tab_map/geojson.png";
// import shapefile from "@/shared/assets/svg/tab_map/shapefile.png";
// import parquet from "@/shared/assets/svg/tab_map/parquet.png";
import listadoCapa from "@/shared/assets/svg/tab_map/listado_capas.svg";

import distancia from "@/shared/assets/svg/tab_map/measure-distance.svg";
import areaPerimetro from "@/shared/assets/svg/tab_map/measure-area.svg";
import borrar from "@/shared/assets/svg/tab_map/borrar.svg";

import generarPDF from "@/shared/assets/svg/tab_map/genera_pdf.svg";
import capturarMapa from "@/shared/assets/svg/tab_map/screenshot.svg";

import cargarAdj from "@/shared/assets/svg/tab_map/upload-file.svg";
import descargas from "@/shared/assets/svg/tab_map/download-file.svg";

// import georeferenciador from "@/shared/assets/svg/tab_map/georeferencion.png";
// import cargarCenso from "@/shared/assets/svg/tab_map/carga_censo.png";
// import estadistica  from '@/shared/assets/svg/tab_map/Icono_estadistica.png';
// import mapstoreLogo from "@/shared/assets/svg/tab_map/mapstore.png";

export const iconsMap = {
  navegar: {
    section: "Navegar",
    explorar: {
      src: explorar,
      alt: "Explorar",
      width: 40,
      height: 40,
    },
    pantallaCompleta: {
      src: mundo,
      alt: "Pantalla Completa",
      width: 25,
      height: 25,
    },
    acercarSeleccion: {
      src: acercarSeleccion,
      alt: "Acercar Selección",
      width: 30,
      height: 30,
    },
    acercar: {
      src: acercar,
      alt: "Acercar",
      width: 30,
      height: 30,
    },
    alejar: {
      src: alejar,
      alt: "Alejar",
      width: 30,
      height: 30,
    },
    // anterior: {
    //   src: anterior,
    //   alt: "Anterior",
    //   width: 30,
    //   height: 30,
    // },
    // siguiente: {
    //   src: siguiente,
    //   alt: "Siguiente",
    //   width: 30,
    //   height: 30,
    // },
    marcadores: {
      src: marcadores,
      alt: "Marcadores",
      width: 40,
      height: 40,
    },
    irA: {
      src: irA,
      alt: "Ir a",
      width: 40,
      height: 40,
    },
  },
  capa: {
    section: "Capa",
    mapaBase: {
      src: mapaBase,
      alt: "Mapa base",
      width: 40,
      height: 40,
    },
    agregarDatos: {
      src: agregarDatos,
      alt: "Agregar datos",
      width: 40,
      height: 40,
    },
    // kml: {
    //   src: kml,
    //   alt: "KML",
    //   width: 45,
    //   height: 45,
    // },
    // geojson: {
    //   src: geojson,
    //   alt: "GeoJSON",
    //   width: 45,
    //   height: 45,
    // },
    // shapefile: {
    //   src: shapefile,
    //   alt: "Shapefile",
    //   width: 45,
    //   height: 45,
    // },
    // parquet: {
    //   src: parquet,
    //   alt: "Parquet",
    //   width: 45,
    //   height: 45,
    // },
    listadoCapas: {
      src: listadoCapa,
      alt: "Listado de capas",
      width: 40,
      height: 40,
    },
  },
  medicion: {
    section: "Medicion",
    distancia: {
      src: distancia,
      alt: "Distancia",
      width: 40,
      height: 40,
    },
    areaPerimetro: {
      src: areaPerimetro,
      alt: "Área y perímetro",
      width: 40,
      height: 40,
    },
    borrar: {
      src: borrar,
      alt: "Borrar",
      width: 30,
      height: 30,
    },
  },
  exportar: {
    section: "Exportar",
    generarPDF: {
      src: generarPDF,
      alt: "Generar PDF",
      width: 40,
      height: 40,
    },
    capturarMapa: {
      src: capturarMapa,
      alt: "Capturar mapa",
      width: 40,
      height: 40,
    },
  },
  masivo: {
    section: "Masivo",
    cargarAdj: {
      src: cargarAdj,
      alt: "Cargar Adj.",
      width: 30,
      height: 30,
    },
    descargas: {
      src: descargas,
      alt: "Descargas",
      width: 30,
      height: 30,
    },
  },
  // georeferenciador: {
  //   section: "Georeferenciador",
  //   buscador: {
  //     src: georeferenciador, 
  //     alt: "Buscador",
  //     width: 60,
  //     height: 60,
  //   },
  // },
  // cargar_censo: {
  //   section: "Cargar Censo",
  //   cargar: {
  //     src: cargarCenso, 
  //     alt: "Cargar Censo",
  //     width: 60,
  //     height: 60,
  //   },
  // },
  // stats: {
  //   section: "Estadisticas",
  //   estadistica: {
  //     src: estadistica, 
  //     alt: "",
  //     width: 60,
  //     height: 60,
  //   },
  // },
  // mapstore: {
  //   section: "MapStore",
  //   mapstore: {
  //     src: mapstoreLogo, 
  //     alt: "",
  //     width: 60,
  //     height: 60,
  //   },
  // },
};
