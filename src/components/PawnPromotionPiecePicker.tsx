import React, { MouseEventHandler, useRef, useEffect } from 'react';

import '../styles/PawnPromotionPiecePicker.css';

import Popper, { PopperPlacementType } from '@mui/material/Popper';
import { ClickAwayListener } from '@mui/material';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';

import Square from './Square.tsx';

interface PawnPromotionPiecePickerProps {
    // onSelectPiece: (piece: 'Q' | 'R' | 'N' | 'B') => void;
    // position: { top: number; left: number };
    anchorProp?: HTMLButtonElement;
    player?: string;
    // handlePromotion?: MouseEventHandler | ((event: Event) => void);
    handlePromotion?: (pieceSelected: string) => void;
}

// const handlePromotionPieceSelected = (squareId: number, event?: Event | undefined) => {
//     console.log(`Handling promotion from PawnPromotionPiecePicker: squareId: ${squareId}; event: ${event}`);
// }

const PawnPromotionPiecePicker: React.FC<PawnPromotionPiecePickerProps> = ({
//     onSelectPiece,
    anchorProp,
    player,
    handlePromotion,
}: {
//     onSelectPiece?: (piece => void);
    anchorProp?: HTMLButtonElement;
    player?: string;
    // handlePromotion?: MouseEventHandler | ((event: Event) => void);
    handlePromotion?: (pieceSelected: string) => void;
}) => {
    const pieces = [
        { notation: 'Q', name: 'Queen', symbol: '♕' },
        { notation: 'R', name: 'Rook', symbol: '♖' },
        { notation: 'N', name: 'Knight', symbol: '♘' },
        { notation: 'B', name: 'Bishop', symbol: '♗' },
    ];

    const handlePromotionPieceSelected = (pieceSelected: string) => {
        // console.log(`Handling promotion from PawnPromotionPiecePicker: squareId: ${squareId}; pieceSelected: ${pieceSelected}; event: ${event}`);
        if (handlePromotion) {
            handlePromotion(pieceSelected);
        }
    }

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | undefined>(anchorProp);
    const [open, setOpen] = React.useState<boolean>(Boolean(anchorEl));
    const placement: PopperPlacementType = (player === 'L') ? 'bottom' : 'top';

    const popperRef = useRef<any>(null);

    useEffect(() => {
        if (open && popperRef.current) {
            // fix misalignment issue due to Popper.js calculating position before DOM is fully rendered... 
            // did not work, smh 
            popperRef.current.update(); 
        }
    }, [open]);

    const handleClosePopper = () => {
        // setAnchorEl(undefined);
        setOpen(!open);
    }

    return (
        <Popper
            sx={{ zIndex: 1000 }}
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition
            // onAbort={}
            ref={popperRef}
        >

            {/* without the TransitionProps and Fade ... the Popper does not show up */}
            {/* without the Paper, promoting throws an error */}

            {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={handleClosePopper}>
                    <Fade {...TransitionProps} timeout={250}> 
                        <Paper>
                            {
                                <div className='pawn-promotion-piece-picker' >
                                    {pieces.map((piece, index) => {
                                        return (
                                            <div key={`promotion-square-${index}`} >  
                                                <Square 
                                                    color={index % 2 ? 'light' : 'dark'}
                                                    keycode={`${player}${piece.notation}`}
                                                    // key={`promotion-square-${index}`}
                                                    id={index + 64} // extra-board squares 
                                                    isHighlighted={false}
                                                    isAltHighlighted={false}
                                                    isSelected={false}
                                                    isAltSelected={false}
                                                    isPromoting={false}
                                                    enableDragAndDrop={false}
                                                    // onMouseEnter={(e: Event) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                                                    // onMouseLeave={(e: Event) => (e.currentTarget.style.backgroundColor = '#fff')}
                                                    // onSquareClick={(index: number, pieceSelected: string, event?: Event) => handlePromotionPieceSelected(index, piece.notation, event)}
                                                    onSquareClick={() => handlePromotionPieceSelected(piece.notation)}
                                                        // TODO research this more ... because they both only return void, args don't have to match? 
                                                    
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </Paper>
                    </Fade> 
                </ClickAwayListener>
            )}
        </Popper>
    );
};

export default PawnPromotionPiecePicker;