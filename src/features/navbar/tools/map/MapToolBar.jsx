import { ButtonTool } from "@/shared/components/ButtonTool"
import {iconsMap} from "./icons/IconsMap"

const MapToolBar = () => {

    const disableButtom = false;
    const disableButtomHistory = false;


  return (
    <div className="flex items-start bg-white shadow-sm w-auto h-full">
        <div className="border-r border-gray-300 flex flex-col justify-between">
            {/* navegar */}
          <div className="flex items-center h-full">
            <ButtonTool icon={iconsMap.navegar.explorar} label={"Explorar"} disabled={disableButtom} />
            <div className={"grid grid-cols-2"}>
              <ButtonTool icon={iconsMap.navegar.pantallaCompleta} label={""} disabled={disableButtom} />
              <ButtonTool icon={iconsMap.navegar.acercarSeleccion} label={""} disabled={disableButtomHistory} />
              <ButtonTool icon={iconsMap.navegar.acercar} label={""} disabled={disableButtom}  />
              <ButtonTool icon={iconsMap.navegar.alejar} label={""} disabled={disableButtom}  />
              {/* <ButtonTool icon={iconsMap.navegar.anterior} label={""} disabled={disableButtomHistory} />
              <ButtonTool icon={iconsMap.navegar.siguiente} label={""} disabled={disableButtomHistory}  /> */}
            </div>
            <ButtonTool icon={iconsMap.navegar.marcadores} label={"Marcadores"} disabled={disableButtom} />
            <ButtonTool icon={iconsMap.navegar.irA} label={"Ir a"} disabled={disableButtom} />
          </div>
          <span className="text-[12px] text-center text-gray-900 capitalize">
            {iconsMap.navegar.section}
          </span>
        </div>
        {/* capa */}
        <div className="border-r border-gray-300 flex flex-col h-full justify-between">
          <div className="flex items-center">
            <ButtonTool icon={iconsMap.capa.mapaBase} label={"Mapa base"} disabled={disableButtom} />
            <ButtonTool icon={iconsMap.capa.agregarDatos} label={"Agregar datos"} disabled={disableButtom} />
            <ButtonTool icon={iconsMap.capa.listadoCapas} label={"Listado de capas"} disabled={disableButtom} />
          </div>
          <span className="text-[12px] text-center text-gray-900 capitalize">
            {iconsMap.capa.section}
          </span>
        </div>
        {/* Medicion */}
        <div className="border-r border-gray-300 flex flex-col h-full justify-between">
          <div className="flex items-center">
            <ButtonTool icon={iconsMap.medicion.distancia} label={"Distancia"} disabled={disableButtom} />
            <ButtonTool icon={iconsMap.medicion.areaPerimetro} label={"Área y Perimetro"} disabled={disableButtom} />
            <ButtonTool icon={iconsMap.medicion.borrar} label={"Borrar"} disabled={disableButtom} />
          </div>
          <span className="text-[12px] text-center text-gray-900 capitalize">
            {iconsMap.medicion.section}
          </span>
        </div>
        {/* Exportar */}
        <div className="border-r border-gray-300 flex flex-col h-full justify-between">
          <div className="flex items-center">
            <ButtonTool icon={iconsMap.exportar.generarPDF} label={"Generar PDF"} disabled={disableButtom} />
            <ButtonTool icon={iconsMap.exportar.capturarMapa} label={"Capturar mapa"} disabled={disableButtom} />
          </div>
          <span className="text-[12px] text-center text-gray-900 capitalize">
            {iconsMap.exportar.section}
          </span>
        </div>
        {/* Masivo */}
        <div className="border-r border-gray-300 flex flex-col h-full justify-between">
          <div className="flex flex-col items-center">
            <ButtonTool layout="row" icon={iconsMap.masivo.cargarAdj} label={"Cargar Adj."} disabled={disableButtom} />
            <ButtonTool layout="row" icon={iconsMap.masivo.descargas} label={"Descargas"} disabled={disableButtom} />
          </div>
          <span className="text-[12px] text-center text-gray-900 capitalize">
            {iconsMap.masivo.section}
          </span>
        </div>
    </div>
  )
}

export default MapToolBar