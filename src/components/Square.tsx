import React, { MouseEventHandler } from 'react';

import { withDroppable } from './hoc/DroppableWrapper.tsx';

import Piece, { getPieceTypeByKeycode, DraggablePiece, keycodeToComponent, getPieceElementByKeycode } from './Piece'; // keycodeToComponent
import PawnPromotionPiecePicker from './PawnPromotionPiecePicker';

import { 
  SquareProp,
  SquareState,
  DraggableDroppableChild,
  // PromotionSquareProp,
} from '../utils/types.ts';
import DraggableWrapper, { withDraggable } from './hoc/DraggableWrapper.tsx';

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
    // //   const pieceChild = getPieceTypeByKeycode(this.props.keycode);
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

  // handleClickPromotion: MouseEventHandler = (event) => {
  handleClickPromotion = (squareId: number, pieceSelected: string, event?: Event) => {
    // console.log(`Handling promotion from Square: squareId: ${squareId}; pieceSelected: ${pieceSelected}; event: ${event}`);
    if (this.props.onPromote && event) this.props.onPromote(squareId, pieceSelected, event);
  }

  render() {

    let classNames: string[] = [];
    classNames.push('square');
    if (this.props.color) classNames.push(this.props.color);
    if (this.props.isHighlighted) classNames.push('highlighted');
    if (this.props.isAltHighlighted) classNames.push('altHighlighted');
    if (this.props.isSelected || this.props.isAltSelected) classNames.push('selected');
    if (this.props.id % 8 === (this.props.isBoardFlipped ? 7 : 0)) classNames.push('labelRank');
    if (Math.floor(this.props.id / 8) === (this.props.isBoardFlipped ? 0 : 7)) classNames.push('labelFile');

    let handlers: { [handlerName: string]: MouseEventHandler<HTMLButtonElement> } = {};
    handlers.onClick = this.handleClick;
    handlers.onContextMenu = this.handleRightClick;
    // or do () => this.handleClick() to *not* pass event arg 

    // let childType: typeof Piece | undefined = undefined;
    // if (this.props.keycode !== '') childType = getPieceTypeByKeycode(this.props.keycode as keyof typeof keycodeToComponent);
    // // let draggableChildType
    // // // let childType;
    // // // if (this.props.enableDragAndDrop) 
    // // //   childType = typeof type | typeof DraggableDroppableChild<HTMLButtonElement;
    // // if (childType) {

    // }
    const child = getPieceElementByKeycode(this.props.keycode, this.props.enableDragAndDrop, `piece-${this.props.id}`);
    // let child = undefined;
    // if (this.props.keycode !== '') child = getPieceElementByKeycode(this.props.keycode, this.props.enableDragAndDrop); 
    // THIS IS A HOOK?? Ugh... Oh, no it's not, but it calls a hook ... instead of that, let's use DraggableGenericPiece here?? 
    return (
      <>
        <button 
          className={classNames.join(' ')} 
          id={`${this.props.id}`} 
          // access this via parentElement of piece for drag/drop ??? 
          data-square-id={this.props.id}
          data-square-rank={8 - Math.floor(this.props.id / 8)}
          data-square-file={'abcdefgh'.charAt(this.props.id % 8)}

          // DROPPABLE attribute
          // ref={setNodeRef}
          ref={this.props.forwardedRef} // this is critical for getting 
          // the forwarded ref from the DroppableWrapper 
          // if the Square is used in the base un-Droppable form, this
          // doesn't mess anything up (so far) 

          {...handlers}
        >
          {/* {
            childType && React.createElement(childType) // , this.props) // we actually currently don't use any props for piece... 
            // squares are what handles logic, just rendering a "new" static piece based on squareProps ... although we could 
            // supply a prop to child to determine whether to render a draggable piece or not, while we figure out this class casting up here 
            // right now all pieces are draggable by default 
          } */}
          {/* {
            childType ? (
              this.props.enableDragAndDrop ? (
                // withDraggable(childType)({}) // this is a hook, it cannot be called here in this class component 
                // <DraggablePiece /> // not working yet either 
                // DraggablePiece(childType) // this is also a hook :/ 
                // <DraggableWrapper id={this.props.id} children={React.createElement(childType)}/>
                React.createElement(childType)
              ) : React.createElement(childType)
            ) : undefined
          } */}
          {
            child
          }
        </button>

        {
          this.props.isPromoting && (
            <PawnPromotionPiecePicker 
              anchorProp={this.props.promotionSquare}
              player={this.props.id < 8 ? 'L' : 'D'}
              handlePromotion={this.handleClickPromotion}
            />
          )
        }
      </>
    );
  }
}

export default Square;

export const DroppableSquare = withDroppable(Square);