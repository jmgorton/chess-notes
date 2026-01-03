import React, { MouseEventHandler } from 'react';

import { withDroppable } from './hoc/DroppableWrapper.tsx';

import { keycodeToComponent, getPieceByKeycode } from './Piece';
import PawnPromotionPiecePicker from './PawnPromotionPiecePicker';

import { 
  SquareProp,
  SquareState,
} from '../utils/types.ts';

class Square extends React.Component<SquareProp, SquareState> {

  // promotionPiecePicker = React.createElement(PawnPromotionPiecePicker);

  constructor(props: SquareProp) {
    super(props);
    this.state = {
      ...this.state,
      // promotionPiecePicker: null,
      // promotionSquare: undefined,
      // playerPromoting: undefined,
    }
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
    return (
      <>
            <button 
              className={
                  "square " + 
                  this.props.color + 
                  (this.props.isHighlighted ? " highlighted" : "") + 
                  (this.props.isAltHighlighted ? " altHighlighted" : "") + 
                  (this.props.isSelected || this.props.isAltSelected ? " selected" : "")
              } 
              // DROPPABLE attribute
              // ref={setNodeRef}
              // forwardedRef={this.props.forwardedRef}
              ref={this.props.forwardedRef} // this is critical for getting 
              // the forwarded ref from the DroppableWrapper 
              // if the Square is used in the base un-Droppable form, this
              // doesn't mess anything up (so far) 

              id={`${this.props.id}`} // access this via parentElement of piece for drag/drop


              // onClick={() => this.handleClick()} // for when handleClick has no arguments 
              onClick={this.handleClick} // for when handleClick has event argument 
              data-square-id={this.props.id}
              onContextMenu={this.handleRightClick}
              // onContextMenu={() => this.handleRightClick()}
            >
              {
                  this.props.keycode && 
                  this.props.keycode in keycodeToComponent && 
                  React.createElement(keycodeToComponent[this.props.keycode as keyof typeof keycodeToComponent], this.props)

                  // React.createElement(getPieceByKeycode(this.props.keycode), this.props)

                  // (
                  //   (this.props.enableDragAndDrop && false) ? // TODO testing remove later
                  //   // withDraggable(getPieceByKeycode(this.props.keycode))(this.props) 
                  //   <DraggableWrapper 
                  //     id={`draggable-${this.props.id}-${useUniqueId}`}
                  //     children={withDraggable(getPieceByKeycode(this.props.keycode))}
                  //   />
                  //     :
                  //   React.createElement(getPieceByKeycode(this.props.keycode), this.props)
                  // )

                  // (this.props.enableDragAndDrop ? 
                  //   React.createElement(
                  //     getPieceByKeycode(this.props.keycode, true)!, 
                  //     this.props
                  //   )
                  //     :
                  //   React.createElement(
                  //     getPieceByKeycode(this.props.keycode)!,
                  //     this.props
                  //   )
                  // )
              }
            </button>

        {
          this.props.isPromoting && ( // this.promotionPiecePicker // this.state.promotionPiecePicker
            <PawnPromotionPiecePicker 
              anchorProp={this.props.promotionSquare} // {this.state.promotionSquare}
              player={this.props.id < 8 ? 'L' : 'D'} // {this.state.playerPromoting}
            />
          )
        }
      </>
    );
  }
}

export default Square;

export const DroppableSquare = withDroppable(Square);