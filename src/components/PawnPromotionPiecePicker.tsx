import React from 'react';

// import Box from '@mui/material/Box';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
// import Paper from '@mui/material/Paper';

import Square from './Square.tsx';

// function PositionedPopper() {
//   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
//   const [open, setOpen] = React.useState(false);
//   const [placement, setPlacement] = React.useState<PopperPlacementType>();

//   const handleClick =
//     (newPlacement: PopperPlacementType) =>
//     (event: React.MouseEvent<HTMLButtonElement>) => {
//       setAnchorEl(event.currentTarget);
//       setOpen((prev) => placement !== newPlacement || !prev);
//       setPlacement(newPlacement);
//     };

//   return (
//     <Box sx={{ width: 500 }}>
//       <Popper
//         // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
//         sx={{ zIndex: 1200 }}
//         open={open}
//         anchorEl={anchorEl}
//         placement={placement}
//         transition
//       >
//         {({ TransitionProps }) => (
//           <Fade {...TransitionProps} timeout={350}>
//             <Paper>
//               <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
//             </Paper>
//           </Fade>
//         )}
//       </Popper>
//       <Grid container sx={{ justifyContent: 'center' }}>
//         <Grid>
//           <Button onClick={handleClick('top-start')}>top-start</Button>
//           <Button onClick={handleClick('top')}>top</Button>
//           <Button onClick={handleClick('top-end')}>top-end</Button>
//         </Grid>
//       </Grid>
//       <Grid container sx={{ justifyContent: 'center' }}>
//         <Grid size={6}>
//           <Button onClick={handleClick('left-start')}>left-start</Button>
//           <br />
//           <Button onClick={handleClick('left')}>left</Button>
//           <br />
//           <Button onClick={handleClick('left-end')}>left-end</Button>
//         </Grid>
//         <Grid container direction="column" sx={{ alignItems: 'flex-end' }} size={6}>
//           <Grid>
//             <Button onClick={handleClick('right-start')}>right-start</Button>
//           </Grid>
//           <Grid>
//             <Button onClick={handleClick('right')}>right</Button>
//           </Grid>
//           <Grid>
//             <Button onClick={handleClick('right-end')}>right-end</Button>
//           </Grid>
//         </Grid>
//       </Grid>
//       <Grid container sx={{ justifyContent: 'center' }}>
//         <Grid>
//           <Button onClick={handleClick('bottom-start')}>bottom-start</Button>
//           <Button onClick={handleClick('bottom')}>bottom</Button>
//           <Button onClick={handleClick('bottom-end')}>bottom-end</Button>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

interface PawnPromotionPiecePickerProps {
    // onSelectPiece: (piece: 'Q' | 'R' | 'N' | 'B') => void;
    // position: { top: number; left: number };
    anchorProp?: HTMLButtonElement;
    player?: string;
}

// const PawnPromotionPiecePicker: React.FC<PawnPromotionPiecePickerProps> = () => {
const PawnPromotionPiecePicker: React.FC<PawnPromotionPiecePickerProps> = ({
//     onSelectPiece,
//     // position,
    anchorProp,
    player,
}: {
//     onSelectPiece?: (piece => void);
    anchorProp?: HTMLButtonElement;
    player?: string;
}) => {
    const pieces = [
        { notation: 'Q', name: 'Queen', symbol: '♕' },
        { notation: 'R', name: 'Rook', symbol: '♖' },
        { notation: 'N', name: 'Knight', symbol: '♘' },
        { notation: 'B', name: 'Bishop', symbol: '♗' },
    ];

    const anchorEl: HTMLButtonElement | undefined = anchorProp;
    const open: boolean = true;
    const placement: PopperPlacementType = 'bottom';

    // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null | undefined>(anchorProp);
    // const [open, setOpen] = React.useState(true);
    // const [placement, setPlacement] = React.useState<PopperPlacementType>('bottom');

    // const handleClick =
    //     (newPlacement: PopperPlacementType) =>
    //     (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    //     setOpen((prev) => placement !== newPlacement || !prev);
    //     setPlacement(newPlacement);
    //   };

    return (
        <Popper
            // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
            sx={{ zIndex: 1200 }}
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition
        >
            {/* without the TransitionProps and Fade ... the Popper does not show up */}
            {/* currently, with these, promoting throws an error */}

            {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}> 
                {
                    <>
                    {pieces.map((piece, index) => {
                        return (
                            <Square 
                                // style={{
                                //     backgroundColor: '#f0f0f0',
                                //     border: '2px solid #333',
                                //     borderRadius: '8px',
                                //     padding: '4px',
                                // }}
                                keycode={`${player}${piece.notation}`}
                                key={`promotion-square-${index}`}
                                id={index + 64} // extra-board squares 
                                isHighlighted={false}
                                isAltHighlighted={false}
                                isSelected={false}
                                isAltSelected={false}
                                isPromoting={false}
                                // onMouseEnter={(e: Event) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                                // onMouseLeave={(e: Event) => (e.currentTarget.style.backgroundColor = '#fff')}
                                // title={piece.name}
                            />
                        )
                    })}
                    </>
                }
            </Fade> 
            )}
        </Popper>
    );

    // return (
    //     <div
    //         className="pawn-promotion-picker"
    //         style={{
    //             position: 'absolute',
    //             top: `${position.top}px`,
    //             left: `${position.left}px`,
    //             backgroundColor: '#f0f0f0',
    //             border: '2px solid #333',
    //             borderRadius: '8px',
    //             padding: '8px',
    //             display: 'grid',
    //             gridTemplateColumns: 'repeat(2, 1fr)',
    //             gap: '8px',
    //             zIndex: 1000,
    //             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    //         }}
    //     >
    //         {pieces.map((piece) => (
    //             <button
    //                 key={piece.notation}
    //                 onClick={() => onSelectPiece(piece.notation as 'Q' | 'R' | 'N' | 'B')}
    //                 style={{
    //                     padding: '12px',
    //                     fontSize: '24px',
    //                     border: '1px solid #ccc',
    //                     borderRadius: '4px',
    //                     backgroundColor: '#fff',
    //                     cursor: 'pointer',
    //                     transition: 'background-color 0.2s',
    //                 }}
    //                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
    //                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
    //                 title={piece.name}
    //             >
    //                 {piece.symbol}
    //             </button>
    //         ))}
    //     </div>
    // );
};

export default PawnPromotionPiecePicker;