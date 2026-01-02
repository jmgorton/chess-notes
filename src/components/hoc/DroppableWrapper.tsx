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
  const Wrapper = (props: any) => {
    const { isOver, setNodeRef } = useDroppable({
      id: props.droppableId, // || 'droppable', // Allow ID to be passed
    });

    console.log(`In the withDroppable Wrapper!`);

    return (
      <WrappedComponent
        {...props}
        isOver={isOver}
        color={isOver ? 'green' : props.color}
        setNodeRef={setNodeRef}
      />
    );
  };
  return Wrapper;
};

// export default withDroppable;
