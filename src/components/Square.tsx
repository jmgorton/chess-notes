import React, { MouseEventHandler } from 'react';
import { keycodeToComponent } from './Piece';
import PawnPromotionPiecePicker from './PawnPromotionPiecePicker';

import { 
  SquareProp,
  SquareState,
} from '../utils/types.ts';

class Square extends React.Component<SquareProp, SquareState> {
  constructor(props: SquareProp) {
    super(props);
    this.state = {
      ...this.state,
      // isHighlighted: this.props.isHighlighted || false,
      // isSelected: this.props.isSelected || false,
      promotionPiecePicker: null,
    }
    this.handleClick = this.handleClick.bind(this);
    // this.handleRightClick = this.handleRightClick.bind(this); // not necessary for arrow functions 
    // this.handleStartPromotion = this.handleStartPromotion.bind(this);

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

    // const promotionPiecePicker = (
    //   <PawnPromotionPiecePicker anchorProp={button} />
    // )
  }

  // promotionPiecePicker = (
  //   <PawnPromotionPiecePicker />
  // )

  // promotionPiecePicker: React.ReactElement | null = null; // typeof PawnPromotionPiecePicker | null = null;

    // promotionPiecePicker = (
    //   <PawnPromotionPiecePicker 
    //     anchorProp={event.currentTarget}
    //   />
    // )

  // React.DragEvent 
  handleStartPromotion = (event: Event) => {
    // if (event) event.preventDefault();
    console.log("Promoting...")
    console.log(event.currentTarget);

    if (!(event.currentTarget instanceof HTMLButtonElement)) {
      console.log('Expected HTMLButtonElement for event.currentTarget; Got ' + typeof event.currentTarget);
      return
    }

    // this.promotionPiecePicker = (
    //   <PawnPromotionPiecePicker 
    //     anchorProp={event.currentTarget}
    //   />
    // )

    this.setState({
      ...this.state,
      promotionPiecePicker: <PawnPromotionPiecePicker anchorProp={event.currentTarget} player={this.props.keycode?.charAt(0)} />,
    })
  }

  handleClick(event: any) {
    // this.setState(prevState => ({
    //   ...prevState,
    //   isSelected: !prevState.isSelected,
    // }));

    // if (this.props.keycode === "LP") {
    //   // alert("This is a pawn square, id: " + this.props.id);
    //   this.props.onPawnClick(this.props.id);
    // }

    // console.log(`Square#handleClick... ${this.props.isPromoting ? 'Passing ' + event + ' to this#handleStartPromotion' : 'Not promoting.'}`)

    if (this.props.isPromoting) { // || (this.props.isHighlighted && this.props.id < 8)) { // uhhh, not a pawn 
      console.log('Before this.props.onSquareClick');
      this.handleStartPromotion(event);
    }

    if (this.props.onSquareClick) this.props.onSquareClick(this.props.id);

    // if (this.props.isPromoting) { // || (this.props.isHighlighted && this.props.id < 8)) {
    //   console.log('After this.props.onSquareClick');
    //   this.handleStartPromotion(event);
    // }
  }

  handleRightClick: MouseEventHandler = (event) => { // (event: any) { // Event, MouseEvent, MouseEvent<MouseElement, MouseEvent>, MouseEventHandler
  // const handleRightClick: MouseEventHandler {
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

  testEvent() {
    alert("This is a test event from Square");
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
          // onClick={() => props.onClick(props.id)} // prop onClick 

          // onClick={() => this.handleClick()} // for when handleClick has no arguments 
          onClick={this.handleClick} // for when handleClick has event argument 
          data-square-id={this.props.id}
          onContextMenu={this.handleRightClick}
          // testevent={() => this.testEvent()}
          // testevent={this.testEvent}
          // onContextMenu={() => this.handleRightClick()}

          // handleStartPromotion={this.props.isPromoting ? (e) => this.handleStartPromotion(e) : () => {}}

          // key={this.props.id}
          // key={`${this.props.id}-${this.props.pieceCode}-0`} // update this key??? 
          // key={this.props.key} // key is stripped from props in React -- can't do this here 
        >
          {
              this.props.keycode && 
              this.props.keycode in keycodeToComponent && 
              React.createElement(keycodeToComponent[this.props.keycode as keyof typeof keycodeToComponent], this.props)
          }
        </button>
        {/* {this.state.promotionPiecePicker} */}
        {
          this.props.isPromoting && this.state.promotionPiecePicker
        }
      </>
    );
  }
}

// class LightSquare extends Square {
//   color = "light";
// }

// class DarkSquare extends Square {
//   color = "dark";
// }

export default Square;