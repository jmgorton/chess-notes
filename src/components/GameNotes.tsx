import React, { useState } from 'react';

interface GameNotesProps {
    zobristHash: string;
    metadata?: Record<string, any>;
}

export const GameNotes: React.FC<GameNotesProps> = ({ zobristHash, metadata }) => {
    const [notes, setNotes] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSaveNotes = async (): Promise<void> => {
        setIsSaving(true);
        try {
            await saveNotesToDatabase(zobristHash, notes, metadata);
            // Optional: Show success message or reset notes
        } catch (error) {
            console.error('Failed to save notes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="game-notes">
            {/* <h3>Position Notes</h3> */}
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes for this position..."
                rows={6}
                disabled={isSaving}
                className="game-notes-textarea"
            />
            <button onClick={handleSaveNotes} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Notes'}
            </button>
        </div>
    );
};

// TODO: Implement database save logic
async function saveNotesToDatabase(
    zobristHash: string,
    notes: string,
    metadata?: Record<string, any>
): Promise<void> {
    // TODO: Make API call to save notes to SQLite or DynamoDB
    throw new Error('Not implemented');
}