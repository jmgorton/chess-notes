import React from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  DragEndEvent,
  pointerWithin,
  DragStartEvent,
} from '@dnd-kit/core';
// import type { ActivationConstraint } from '@dnd-kit/core'; // DNE 

function handleDragEnd(event: DragEndEvent) { // React.SyntheticEvent? any? Drag{Start,End}Event from dnd-kit 
    // console.log(`DragDropContextWrapper#handleDragEnd(${event})`);
    const {over} = event;

    // if the item is dropped over a Droppable container, set it as the parent;
    //   otherwise, set it back to XX~~null~~XX what it was before, not null ... 
    //   we have multiple Draggables and multiple Droppables on the board 
    // it almost might be preferable to use the sorted packages

    if (over) {
        // console.log(over.id);
        if (typeof over.id === 'number') return over.id;
        // this.props.handleSquareClick(over.id);
        const droppableWrapperId = over.id as string;
        const droppableIdMatcher: RegExp = /droppable-(\d+)/;

        const matchResult = droppableWrapperId.match(droppableIdMatcher);
        if (matchResult && matchResult[1]) {
            // matchResult is the full match "droppable-{squareId}"
            // matchResult[1] is the first capture group, squareId
            const squareId = Number(matchResult[1]);
            return squareId;
        }
    } else {
        console.log(`Over was null on DragEndEvent: ${event}`);
    }
}

function handleDragStart(event: DragStartEvent) {
    // determine which squares to enable as legal Droppables 
    // console.log(`DragDropContextWrapper#handleDragStart(${event})`);
    // const {active, activatorEvent} = event;

    const squareIdOfDragStart = getSquareIdWhereDragBegan(event);
    if (squareIdOfDragStart === undefined) {
        console.warn("Could not locate the squareId where this drag started.");
    } else {
        // console.log(`Drag started on square: ${squareIdOfDragStart}`);
        // if (this.props.handleSquareClick) this.props.handleSquareClick(squareIdOfDragStart);
    }
    
    // if (active) {
    //     console.log(activatorEvent);
    //     // this.props.handleSquareClick(over.id); 
    //     // // just imagine it as a click??? is it that easy? meh - yes and no
    // }

    // this and props are not accessible here
    return squareIdOfDragStart;
}

// holy mother of ugly code, at the very least we can write a function for like
//   conditionalConsoleLog(message: string, condition: boolean)
//   ... EUHGH brother 
//   but it works, so whatever 
function getSquareIdWhereDragBegan(event: DragStartEvent, includeLogging: boolean = false): number | undefined {
    const {activatorEvent} = event; // destructure for the property we want 

    // srcElement, target, toElement might be useful properties of activatorEvent 
    //   they point to <img class="piece"> which is our Piece component ... 
    //   our piece has no id, might need to keep track of each piece state + id
    //   in Game or something... wanted to do that anyway 
    // target.parentElement, target.parentNode could also be very useful right now
    //   can get the id from those!? id is "" rn, set it in button class of Square
    if (activatorEvent instanceof MouseEvent) {
        if (includeLogging) console.log(`\`activatorEvent\` is instanceof MouseEvent. found: ${activatorEvent}`);
        if (activatorEvent.target && activatorEvent.target instanceof EventTarget) {
            if (includeLogging) console.log(`\`activatorEvent.target\` is instanceof EventTarget. found: ${activatorEvent.target}`);
            if ('parentElement' in activatorEvent.target) {
                if (includeLogging) console.log(`parentElement found in \`activatorEvent.target\`: ${activatorEvent.target.parentElement}`);
                if (activatorEvent.target.parentElement && activatorEvent.target.parentElement instanceof Element) {
                    if (includeLogging) console.log(`\`parentElement\` is instanceof Element: found ${activatorEvent.target.parentElement}`);
                    if ('id' in activatorEvent.target.parentElement) {
                        if (includeLogging) console.log(`\`parentElement\` has id: ${activatorEvent.target.parentElement.id}`);
                        const toReturn = Number(activatorEvent.target.parentElement.id);
                        if (isNaN(toReturn)) {
                            if (includeLogging) console.log(`Found an ID, but it's not a number.`);
                        } else {
                            return toReturn;
                        }
                    } else {
                        if (includeLogging) console.log(`\`parentElement\` has no id.`);
                    }
                } else {
                    if (includeLogging) console.log(`\`parentElement\` not instanceof Element: found ${activatorEvent.target.parentElement}`);
                }
            } else {
                if (includeLogging) console.log(`No \`parentElement\` found in \`activatorEvent.target\`.`)
            }
        } else {
            if (includeLogging) console.log(`No EventTarget found at \`activatorEvent.target\`: found ${activatorEvent.target}`);
        }
    } else {
        if (includeLogging) console.log(`activatorEvent not instanceof MouseEvent: found ${activatorEvent}`);
    }

    return undefined;
}

// Define the HOC with a generic type for the wrapped component's props
export const withDndContext = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithDnd = (props: P) => {
    // Configure activation constraints (e.g., a distance of 10 pixels)
    // const activationConstraint: ActivationConstraint = {
    const activationConstraint = {
      distance: 10, // Require the pointer to move 10px before dragging starts
    };

    const sensors = useSensors(
      useSensor(MouseSensor, { activationConstraint }),
      useSensor(TouchSensor, { activationConstraint }),
      useSensor(KeyboardSensor, {
        // Keyboard sensor activation can have its own constraints if needed
      })
    );

    // logging event here actually logs the event details in the console 
    // whereas in the handleDragStart function above, it just logs an [object Object] 
    // why is that?? TODO research that more 
    const onDragStart = (event: DragStartEvent) => {
        console.log('Drag started:', event);
        // event === DragStartEvent
        // event.activatorEvent === MouseEvent
        
        const squareIdOfDragStart = handleDragStart(event);
        console.log('Drag started on square ' + squareIdOfDragStart);
        if (
            'handleSquareClick' in props && 
            typeof props.handleSquareClick === 'function' && 
            squareIdOfDragStart
        ) {
            // TODO refactor and also clear any existing highlighting first
            //   treat as a brand new click
            //   if squares are highlighted and we try to drag the piece,
            //   it is considered a second click and unhighlights the squares 
            props.handleSquareClick(squareIdOfDragStart);
        }
    }

    const onDragEnd = (event: DragEndEvent) => {
        console.log('Drag ended:', event);
        const squareIdOfDragEnd = handleDragEnd(event);
        console.log('Drag ended on square ' + squareIdOfDragEnd);

        //   // if the item is dropped over a Droppable container, set it as the parent;
        //   //   otherwise, set it back to XX~~null~~XX what it was before, not null ... 
        //   //   we have multiple Draggables and multiple Droppables on the board 
        //   // it almost might be preferable to use the sorted packages

        if (
            'handleSquareClick' in props && 
            typeof props.handleSquareClick === 'function' && 
            squareIdOfDragEnd
        ) {
            // TODO refactor and also clear any existing highlighting first
            //   treat as a brand new click
            //   if squares are highlighted and we try to drag the piece,
            //   it is considered a second click and unhighlights the squares 
            props.handleSquareClick(squareIdOfDragEnd);
        }
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        // onDragAbort={}
        // onDragCancel={}
        // onDragMove={}
        // onDragOver={}
        // onDragPending={}
      >
        <WrappedComponent {...props} />
      </DndContext>
    );
  };
  return ComponentWithDnd;
};
