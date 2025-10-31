import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const SortableItemWrapper = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default function SortableListContainer({
  items = [],
  onOrderChange,
  renderItem,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const [orderedItems, setOrderedItems] = useState(items);

  const mapRef = useSelector((state) => state.mapReducer.mapRef);
  const map = mapRef?.getMap?.();

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedItems.findIndex((i) => i.id === active.id);
    const newIndex = orderedItems.findIndex((i) => i.id === over.id);
    const newOrder = arrayMove(orderedItems, oldIndex, newIndex);

    setOrderedItems(newOrder);
    onOrderChange?.(newOrder);

    if (map && map.isStyleLoaded()) {
      // invertimos el orden visual para mantener coherencia (la última va arriba)
      [...newOrder].reverse().forEach((item) => {
        
        const layerId = item.data.styles[0].id;
        if (map.getLayer(layerId)) {
          try {
            map.moveLayer(layerId);
          } catch (err) {
            console.warn(`No se pudo mover la capa ${layerId}`, err);
          }
        }
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {orderedItems.map((item) => (
          <SortableItemWrapper key={item.id} id={item.id}>
            {renderItem(item)}
          </SortableItemWrapper>
        ))}
      </SortableContext>
    </DndContext>
  );
}
