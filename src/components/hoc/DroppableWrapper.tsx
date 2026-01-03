import React, { ReactNode } from 'react';
import { useDroppable, UniqueIdentifier } from '@dnd-kit/core';

interface DroppableWrapperProps {
  id: UniqueIdentifier;
  children: (isOver: boolean, setNodeRef: (node: HTMLElement | null) => void) => ReactNode;
}

const DroppableWrapper: React.FC<DroppableWrapperProps> = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return <>{children(isOver, setNodeRef)}</>;
};

export default DroppableWrapper;

// WrappedComponent: React.Component >> 'WrappedComponent' cannot be used as a JSX component.
//   Its type 'Component<{}, {}, any>' is not a valid JSX element type.
// WrappedComponent: React.ReactElement >> 'WrappedComponent' cannot be used as a JSX component.
//   Its type 'ReactElement<unknown, string | JSXElementConstructor<any>>' is not a valid JSX element type.
// Should be React.ComponentType (or ComponentType<P> if <P extends something>)
export const withDroppable = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { isOver, setNodeRef } = useDroppable({
      id: 'id' in props ? props.id as string : '', // Allow ID to be passed
      // we use this id in DragDropContextWrapper#onDragEnd 
    });

    return (
      <WrappedComponent
        {...props}
        isOver={isOver}
        // setNodeRef={setNodeRef}
        forwardedRef={setNodeRef}
      />
    );
  };
  return Wrapper;
};
