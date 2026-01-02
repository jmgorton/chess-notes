import React, { ReactNode } from 'react';
import { useDraggable, UniqueIdentifier, DraggableAttributes } from '@dnd-kit/core';
import { Transform } from '@dnd-kit/utilities';

import Piece from '../Piece.tsx';

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
export const withDraggable = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: any) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
      id: props.draggableId || 'draggable', // Allow ID to be passed
    });

    // console.log(`In the withDraggable Wrapper!`);
    // console.debug(``)

    return (
      <WrappedComponent
        {...props}
        {...attributes}
        {...listeners}
        setNodeRef={setNodeRef}
        transform={transform ? `translate3d(${transform.x}px ${transform.y}px, 0)` : undefined}
        style={{opacity: isDragging ? 0.5 : 1}}
        zindex={transform ? '11' : '10'}
      />
    );
  };
  return Wrapper;
};