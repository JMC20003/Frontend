import { forwardRef, useEffect, useImperativeHandle } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl } from 'react-map-gl';
import { useDispatch,useSelector } from 'react-redux';
import { SRMode, SRStyle } from './MapboxScaleRotateMode';
import DragCircleCustomMode from "./drawCircle/drawCircle"
import { setMapboxDrawRef } from '@/shared/redux/features/mapSlice';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import FreehandMode from './freehandMode/FreehandMode'

const DrawControl = forwardRef((props, ref) => {
  const dispatch = useDispatch()

  const { activeDrawMode } = useSelector((state) => state.mapReducer);
  const modes = MapboxDraw.modes;
  modes.draw_rectangle = DrawRectangle;
  modes.draw_circle = DragCircleCustomMode;

  const draw = useControl(
    () => new MapboxDraw({
      displayControlsDefault: false, 
      controls:{
        point: false,
        line_string: false,
        polygon: false
      },
      userProperties: true,
      styles: SRStyle,
      modes: Object.assign(modes, {
        scaleRotateMode: SRMode,
        draw_freehand:FreehandMode,
      }),
    }),
    ({ map }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
      map.on('draw.modechange', props.modeChange);
      map.on('draw.combine', props.onCombine);
      map.on('draw.uncombine', props.onUncombine);
    },
    ({ map }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
      map.off('draw.modechange', props.modeChange);
      map.off('draw.combine', props.onCombine);
      map.off('draw.uncombine', props.onUncombine);
    },
    {
      position: props.position
    },
  );
  useEffect(() => {
    if (draw) {
      dispatch(setMapboxDrawRef(draw));
    }
    return ()=>{
      dispatch(setMapboxDrawRef(null))
    }
  }, [draw,dispatch]);

  useEffect(() => {
      if (activeDrawMode && draw) {
        draw.changeMode(activeDrawMode);
        console.log('Cambiando modo de dibujo →', activeDrawMode);
      }
  }, [activeDrawMode, draw]);

  useImperativeHandle(ref, () => ({
    add: draw.add.bind(draw),
    delete: draw.delete.bind(draw),
    deleteAll: draw.deleteAll.bind(draw),
    getAll: draw.getAll.bind(draw),
    changeMode: draw.changeMode.bind(draw),
  }));

  return null;
});

DrawControl.displayName = "DrawControl";

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
  modeChange: () => {},
  onCombine: () => {},
  onUncombine: () => {}
};

export default DrawControl;