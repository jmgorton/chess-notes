import React, { useEffect, useState, useRef, MouseEventHandler, RefObject } from 'react';
import { createPortal } from 'react-dom';

import { ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface SettingsProps {
    onCloseSettings: () => void; // MouseEventHandler<HTMLDivElement>;
    onUpdateSettings?: (event: Event) => void;
    // put togglable settings here 
    enableDragAndDrop?: boolean;
    highlightLegalMoves?: boolean;

}

const SettingsContent: React.FC<SettingsProps> = (props: SettingsProps) => {

    const handleToggleSetting = (setting: string) => {
        console.log(`Toggle setting for: ${setting}`);
    }

    return (
        <>
            {
                // note: props are read-only 
                Object.entries(props).map(([key, value]) => {
                    if (typeof value !== 'boolean') return; // filter out methods like onCloseSettings
                    return (
                        <p key={key}>
                            <strong>{key}:</strong> 
                            {/* style={{marginRight: 'auto'}} */}
                            {/* {String(value)} */}
                            <ToggleButton 
                                value="check" 
                                selected={value} 
                                onChange={() => handleToggleSetting(key)}
                                sx={{
                                    marginLeft: 'auto',
                                }}
                            >
                                <CheckIcon fontSize='small'/>
                            </ToggleButton>
                        </p>
                    )
                })
            }
        </>
    )
}

export function useCloseOnClickOutside<T extends HTMLElement>(
    handler: () => void // MouseEventHandler?? 
): RefObject<T | null> { // MouseEventHandler ?? 
  const domNodeRef = useRef<T>(null);

  useEffect(() => {
    const maybeHandler = (event: MouseEvent | TouchEvent): void => {
      // If the clicked element is NOT inside the domNodeRef, trigger handler
      if (domNodeRef.current && !domNodeRef.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Listen for both mouse and touch events for 2026 mobile compatibility
    document.addEventListener("mousedown", maybeHandler);
    document.addEventListener("touchstart", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
      document.removeEventListener("touchstart", maybeHandler);
    };
  }, [handler]);

  return domNodeRef;
}


// using React Portals to create my own dialog/modal
// see: https://react.dev/reference/react-dom/createPortal
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