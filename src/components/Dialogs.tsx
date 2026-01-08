import React from 'react';

import { ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { usePortal } from './hoc/PortalWrapper';

import styles from '../styles/Portal.module.css';

interface PortalProps {
    onClosePortal: () => void;
}

interface SettingsProps {
    onClosePortal: () => void; // MouseEventHandler<HTMLDivElement>;
    onUpdateSettings: (key: string, newValue?: any) => void;
    // put togglable settings here 
    enableDragAndDrop?: boolean;
    highlightLegalMoves?: boolean;
}

export const SettingsContent: React.FC<SettingsProps> = (props: SettingsProps) => {

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
                                // className="settings-toggle-button"
                                className={styles.settingsToggleButton}
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

// export default SettingsContent;

const SettingsDialog = (props: SettingsProps) => {
    const SettingsModal = usePortal(SettingsContent);

    return <SettingsModal {...props} />;
}

export default SettingsDialog;
