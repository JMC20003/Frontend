import { ButtonTool } from '@/shared/components/ButtonTool'
import {iconsEdit } from './icons/IconsEdit'

const EditToolbar = () => {
  return (
    <div className="flex items-center bg-white shadow-sm w-auto overflow-hidden text-[10px] gap-1 h-full">
         {/* Editar */}
      <div className="border-r border-gray-300 flex flex-col h-full justify-between">
        <div className="flex items-center w-[150px]">
          <ButtonTool icon={iconsEdit.editar.initEdit} label={iconsEdit.editar.initEdit.alt}
          />
          <ButtonTool icon={iconsEdit.editar.servicioImplantacion} label={iconsEdit.editar.servicioImplantacion.alt}
          />
        </div>
        <span className="text-[12px] text-center text-gray-900">Editar</span>
      </div>
        {/* Cartografia */}
      <div className="border-r border-gray-300 flex flex-col h-full justify-between">
        <div className="flex items-center justify-center h-full">
          <ButtonTool className='w-[70px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.admiArea} label={iconsEdit.cartografia.admiArea.alt}
          />
          <ButtonTool className='w-[50px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.manzana} label={iconsEdit.cartografia.manzana.alt}
          />
          <ButtonTool className='w-[50px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.lote} label={iconsEdit.cartografia.lote.alt}
          />
          <ButtonTool className='w-[50px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.solera} label={iconsEdit.cartografia.solera.alt}
          />
          <ButtonTool className='w-[50px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.ejeVial} label={iconsEdit.cartografia.ejeVial.alt}
          />
          <ButtonTool className='w-[50px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.predial} label={iconsEdit.cartografia.predial.alt}
          />
          <ButtonTool className='w-[60px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.preAsingCto} label={iconsEdit.cartografia.preAsingCto.alt}
          />
          <ButtonTool className='w-[60px] hover:bg-sky-200 h-full' icon={iconsEdit.cartografia.censoCsv} label={iconsEdit.cartografia.censoCsv.alt}
          />
        </div>
        <span className="text-[12px] text-center text-gray-900">Cartografía</span>
      </div>

      {/* Infraestructura */}
      <div className="border-r border-gray-300 flex flex-col justify-between">
        <div className="grid grid-cols-3 items-center h-full">
          <ButtonTool icon={iconsEdit.infraestructura.puntoAcceso} label={iconsEdit.infraestructura.puntoAcceso.alt} />
          <ButtonTool layout='row' icon={iconsEdit.infraestructura.ancla} label={iconsEdit.infraestructura.ancla.alt} />
          <ButtonTool layout='row' icon={iconsEdit.infraestructura.cruceta} label={iconsEdit.infraestructura.cruceta.alt} />
          <ButtonTool layout='row' icon={iconsEdit.infraestructura.ducto} label={iconsEdit.infraestructura.ducto.alt} />
          <ButtonTool layout='row' icon={iconsEdit.infraestructura.soporte} label={iconsEdit.infraestructura.soporte.alt} />
          <ButtonTool layout='row' icon={iconsEdit.infraestructura.cMensajero} label={iconsEdit.infraestructura.cMensajero.alt} />
        </div>
        <span className="text-[12px] text-center text-gray-900">Infraestructura</span>
      </div>

      {/* Red */}
      <div className="border-r border-gray-300 flex flex-col justify-between h-full">
        <div className="flex items-center h-full">
            <ButtonTool icon={iconsEdit.red.terminal} label={iconsEdit.red.terminal.alt}
            />
            <ButtonTool icon={iconsEdit.red.cable} label={iconsEdit.red.cable.alt}
            />
            <ButtonTool icon={iconsEdit.red.cobertura} label={iconsEdit.red.cobertura.alt}
            />
            <ButtonTool icon={iconsEdit.red.borner} label={iconsEdit.red.borner.alt}
            />
        </div>
        <span className="text-[12px] text-center text-gray-900">Red</span>
      </div>
      {/* Red */}
      <div className="border-r border-gray-300 flex flex-col justify-between h-full">
        <div className="flex items-center h-full">
            <ButtonTool className='w-[60px]' icon={iconsEdit.automatizacion.validarProyecto} label={iconsEdit.automatizacion.validarProyecto.alt}
            />
            <ButtonTool className='' icon={iconsEdit.automatizacion.reporte} label={iconsEdit.automatizacion.reporte.alt}
            />
        </div>
        <span className="text-[12px] text-center text-gray-900">Automatización</span>
      </div>
    </div>
  )
}

export default EditToolbar