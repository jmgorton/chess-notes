import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { useCloseOnClickOutside } from '../utils/hooks';

interface SettingsProps {
    onCloseSettings: () => void; // MouseEventHandler<HTMLDivElement>;
    onUpdateSettings?: (key: string, newValue?: any) => void;
    // put togglable settings here 
    enableDragAndDrop?: boolean;
    highlightLegalMoves?: boolean;
}

const SettingsContent: React.FC<SettingsProps> = (props: SettingsProps) => {

    const handleToggleSetting = (setting: string, newValue?: any) => {
        console.log(`Toggle setting for: ${setting}`);
        if (props.onUpdateSettings) props.onUpdateSettings(setting, newValue);
    }

    return (
        <>
            {
                // note: props are read-only 
                Object.entries(props).map(([key, value]) => {
                    if (typeof value !== 'boolean') return; // filter out methods like onCloseSettings
                    return (
                        <div key={key}>
                            <strong>{key}:</strong> 
                            {/* style={{marginRight: 'auto'}} */}
                            {/* {String(value)} */}
                            <ToggleButton 
                                value="check" 
                                selected={value} 
                                onChange={() => handleToggleSetting(key, !value)}
                                className="settings-toggle-button"
                                // sx={[
                                //     {
                                //         marginLeft: 'auto',
                                //     },
                                // ]}
                            >
                                <CheckIcon fontSize='small'/>
                            </ToggleButton>
                        </div>
                    )
                })
            }
        </>
    )
}


// using React Portals to create my own dialog/modal
// see: https://react.dev/reference/react-dom/createPortal
// TODO extend this to other types of children/props 
const CustomSettingsModal: React.FC<SettingsProps> = (props: SettingsProps) => {
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // runs after the DOM is ready, similar to componentDidMount in class components 
        setModalRoot(document.body); // document.getElementById('modal-root')); // for this, add modal-root div to index.html under root 
    }, []);

    const modalContentRef = useCloseOnClickOutside<HTMLDivElement>(props.onCloseSettings);

    if (!modalRoot) return null;

    return createPortal(
        // try onClick modal-overlay closes settings, 
        // and onClick modal-content stopPropagation to keep settings open.
        // this method of closing on click away does not work ... 
        // depends on DOM heirarchy, may be unreliable 

        // next, try creating a custom hook useCloseOnClickOutside
        // that works 
        <div 
            className="modal-overlay" 
            // onClick={props.onCloseSettings}
        >
            <div 
                className="modal-content" 
                // onClick={(e) => e.stopPropagation()}
                ref={modalContentRef}
            > 
                <SettingsContent {...props} />
            </div>
        </div>,
        modalRoot 
    )
}

export default CustomSettingsModal;