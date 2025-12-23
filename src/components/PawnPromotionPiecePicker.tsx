import React from 'react';

interface PawnPromotionPiecePickerProps {
    onSelectPiece: (piece: 'Q' | 'R' | 'N' | 'B') => void;
    position: { top: number; left: number };
}

const PawnPromotionPiecePicker: React.FC<PawnPromotionPiecePickerProps> = ({
    onSelectPiece,
    position,
}) => {
    const pieces = [
        { notation: 'Q', name: 'Queen', symbol: '♕' },
        { notation: 'R', name: 'Rook', symbol: '♖' },
        { notation: 'N', name: 'Knight', symbol: '♘' },
        { notation: 'B', name: 'Bishop', symbol: '♗' },
    ];

    return (
        <div
            className="pawn-promotion-picker"
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                backgroundColor: '#f0f0f0',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            {pieces.map((piece) => (
                <button
                    key={piece.notation}
                    onClick={() => onSelectPiece(piece.notation as 'Q' | 'R' | 'N' | 'B')}
                    style={{
                        padding: '12px',
                        fontSize: '24px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    title={piece.name}
                >
                    {piece.symbol}
                </button>
            ))}
        </div>
    );
};

export default PawnPromotionPiecePicker;