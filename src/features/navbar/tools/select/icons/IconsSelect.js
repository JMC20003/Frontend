import atributoIcon from "@/shared/assets/svg/tab_seleccion/atributo.svg";
import exportarIcon from "@/shared/assets/svg/tab_seleccion/exportar.svg";
import seleccionIcon from "@/shared/assets/svg/tab_seleccion/seleccion.svg";
import ubicacionIcon from "@/shared/assets/svg/tab_seleccion/ubicacion.svg";
import extensionIcon from "@/shared/assets/svg/tab_seleccion/extension.svg";
import circuloIcon from "@/shared/assets/svg/tab_seleccion/circulo.svg";
import lazoIcon from "@/shared/assets/svg/tab_seleccion/lazo.svg";
import lineaIcon from "@/shared/assets/svg/tab_seleccion/linea.svg";
import poligonoIcon from "@/shared/assets/svg/tab_seleccion/poligono.svg";
import puntoIcon from "@/shared/assets/svg/tab_edit/punto_acceso.svg";

export const iconsSelect = {
	seleccion: {
		section: "Selección",
		seleccionar: {
			src: seleccionIcon,
			alt: "Seleccionar ▼",
			width: 32,
			height: 32,
		},
		porAtributo: {
			src: atributoIcon,
			alt: "Por atributos",
			width: 32,
			height: 32,
		},
		porUbicacion: {
			src: ubicacionIcon,
			alt: "Por ubicación",
			width: 32,
			height: 32,
		},
	},
	opciones: {
		section: "Opciones",
		exportar: {
			src: exportarIcon,
			alt: "Exportar",
			width: 32,
			height: 32,
		},
	},
	seleccionDropdown: {
		extension: {
			src: extensionIcon,
			alt: "Extensión",
			width: 32,
			height: 32,
		},
		poligono: {
			src: poligonoIcon,
			alt: "Polígono",
			width: 32,
			height: 32,
		},
		lazo: {
			src: lazoIcon,
			alt: "Lazo",
			width: 32,
			height: 32,
		},
		linea: {
			src: lineaIcon,
			alt: "Línea",
			width: 32,
			height: 32,
		},
		circulo: {
			src: circuloIcon,
			alt: "Círculo",
			width: 32,
			height: 32,
		},
		punto: {
			src: puntoIcon,
			alt: "Punto",
			width: 32,
			height: 32,
		}

	},
};
