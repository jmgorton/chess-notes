import React, { MouseEventHandler } from 'react';

import { withDroppable } from './hoc/DroppableWrapper.tsx';

import { getPieceByKeycode } from './Piece'; // keycodeToComponent
import PawnPromotionPiecePicker from './PawnPromotionPiecePicker';

import { 
  SquareProp,
  SquareState,
  DraggableDroppableChild,
} from '../utils/types.ts';

class Square extends React.Component<SquareProp, SquareState> {


  constructor(props: SquareProp) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    // not necessary for arrow functions 
    // this.handleRightClick = this.handleRightClick.bind(this); 


    // const buttonToRender: HTMLButtonElement = document.createElement('button');
    // // will this get automatically re-rendered when props change??? 
    // buttonToRender.className = 'square ' + this.props.color;
    // if (this.props.isHighlighted) buttonToRender.className += ' highlighted';
    // if (this.props.isAltHighlighted) buttonToRender.className += ' althighlighted';
    // if (this.props.isSelected || this.props.isAltHighlighted) buttonToRender.className += ' selected';
    // buttonToRender.addEventListener('click', (event: MouseEvent) => this.handleClick(event));
    // buttonToRender.addEventListener('contextmenu', () => this.handleRightClick);
    // // buttonToRender.setAttribute('data-square-id', props.id);
    // // the below does not work: You cannot directly pass a React element as a native Node
    // // if (this.props.keycode in keycodeToComponent) {
    // //   const pieceChild = getPieceByKeycode(this.props.keycode);
    // //   buttonToRender.appendChild(React.createElement(pieceChild, this.props));
    // // }

    // const button = (
    //   <button 
    //     className={
    //       "square " + 
    //       this.props.color + 
    //       (this.props.isHighlighted ? " highlighted" : "") + 
    //       (this.props.isAltHighlighted ? " altHighlighted" : "") + 
    //       (this.props.isSelected || this.props.isAltSelected ? " selected" : "")
    //     } 
    //     // onClick={() => this.handleClick()} // for when handleClick has no arguments 
    //     onClick={this.handleClick} // for when handleClick has event argument 
    //     data-square-id={this.props.id}
    //     onContextMenu={this.handleRightClick}
    //   >
    //     {
    //         this.props.keycode && 
    //         this.props.keycode in keycodeToComponent && 
    //         React.createElement(keycodeToComponent[this.props.keycode as keyof typeof keycodeToComponent], this.props)
    //     }
    //   </button>
    // )

  }

  handleClick(event: any) {
    // if (!(event.currentTarget instanceof HTMLButtonElement)) {
    //   console.log('Expected HTMLButtonElement for event.currentTarget; Got ' + typeof event.currentTarget);
    //   return
    // }

    if (this.props.onSquareClick) this.props.onSquareClick(this.props.id, event);
    // console.log(`After props.onSquareClick: isPromoting: ${this.props.isPromoting}`);
  }

  handleRightClick: MouseEventHandler = (event) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }

    // if (!(event instanceof MouseEvent)) {
    //   console.log('Expected MouseEvent for event; Got ' + typeof event);
    //   return
    // }

    // pass both the event and the square id to the parent handler
    if (this.props.onContextMenu) this.props.onContextMenu(event, this.props.id);
  }

  render() {

    let classNames: string[] = [];
    classNames.push('square');
    if (this.props.color) classNames.push(this.props.color);
    if (this.props.isHighlighted) classNames.push('highlighted');
    if (this.props.isAltHighlighted) classNames.push('altHighlighted');
    if (this.props.isSelected || this.props.isAltSelected) classNames.push('selected');

    let handlers: { [handlerName: string]: MouseEventHandler<HTMLButtonElement> } = {};
    handlers.onClick = this.handleClick;
    handlers.onContextMenu = this.handleRightClick;
    // or do () => this.handleClick() to *not* pass event arg 

    let childType = getPieceByKeycode(this.props.keycode);
    let draggableChildType
    // let childType;
    // if (this.props.enableDragAndDrop) 
    //   childType = typeof type | typeof DraggableDroppableChild<HTMLButtonElement;
    if (childType) {

    }
    return (
      <>
        <button 
          className={classNames.join(' ')} 
          id={`${this.props.id}`} 
          // access this via parentElement of piece for drag/drop ??? 
          data-square-id={this.props.id}

          // DROPPABLE attribute
          // ref={setNodeRef}
          ref={this.props.forwardedRef} // this is critical for getting 
          // the forwarded ref from the DroppableWrapper 
          // if the Square is used in the base un-Droppable form, this
          // doesn't mess anything up (so far) 

          {...handlers}
        >
          {
            childType && React.createElement(childType, this.props)
          }
        </button>

        {
          this.props.isPromoting && (
            <PawnPromotionPiecePicker 
              anchorProp={this.props.promotionSquare}
              player={this.props.id < 8 ? 'L' : 'D'}
            />
          )
        }
      </>
    );
  }
}

export default Square;

export const DroppableSquare = withDroppable(Square);