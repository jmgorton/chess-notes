import React, { ReactNode } from 'react';
import { useDraggable, UniqueIdentifier, DraggableAttributes } from '@dnd-kit/core';
import { Transform } from '@dnd-kit/utilities';

import { DraggableDroppableChild } from '../../utils/types.ts';

interface DraggableWrapperProps {
  id: UniqueIdentifier;
  children: (
    attributes: DraggableAttributes, 
    listeners: React.SyntheticEvent | any, 
    setNodeRef: (node: HTMLElement | null) => void, 
    transform: Transform | null,
    isDragging: boolean,
  ) => ReactNode;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ id, children }) => {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id,
  });

  return <>{children(attributes, listeners, setNodeRef, transform, isDragging)}</>;
};

export default DraggableWrapper;

// only Pieces are draggable here ... but this doesn't work for me <P extends Piece>
// what about DraggableDroppableChild<T> or <T extends HTMLAllCollection> or smth... 
// ok, we got it with <T, P extends DraggableDroppableChild<T>> 
export const withDraggable = <T, P extends DraggableDroppableChild<T>>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: any) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
      id: props.draggableId || 'draggable', // Allow ID to be passed
    });

    return (
      <WrappedComponent
        {...props}
        {...attributes}
        {...listeners}
        // setNodeRef={setNodeRef}
        forwardedRef={setNodeRef}
        transform={transform ? `translate3d(${transform.x}px ${transform.y}px, 0)` : undefined}
        style={{opacity: isDragging ? 0.5 : 1}} // opacity was changing (granted, for all pieces...); now it's not at all 
        // zindex={transform ? '11' : '10'}
      />
    );
  };
  return Wrapper;
};