import React from 'react';

import { Input, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ContentCopy } from '@mui/icons-material';

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

const SettingsDialog = (props: SettingsProps) => {
    const SettingsModal = usePortal(SettingsContent);

    return <SettingsModal {...props} />;
}

export default SettingsDialog;

interface UploadModalProps {
    onClosePortal: () => void; // MouseEventHandler<HTMLDivElement>;
    // onUpdateSettings: (key: string, newValue?: any) => void;
    onSubmitNewFEN: (newFEN: string, event?: React.SyntheticEvent) => void;
    currentFEN: string;
    // put togglable settings here 
    // enableDragAndDrop?: boolean;
    // highlightLegalMoves?: boolean;
}

export const UploadContent: React.FC<UploadModalProps> = (props: UploadModalProps) => {
    const [fenToUpload, setFenToUpload] = React.useState<string>(props.currentFEN);

    const handleUploadNewFEN = (newFEN: string, event?: React.SyntheticEvent) => {
        console.log(`Uploading new FEN: ${newFEN}`);
        if (props.onSubmitNewFEN) props.onSubmitNewFEN(newFEN, event);
    }

    return (
        <>
            <div>
                <strong>FEN:</strong> 
                {/* style={{marginRight: 'auto'}} */}
                <Input 
                    value={fenToUpload} 
                    onChange={(e) => setFenToUpload(e.target.value)}
                    className={styles.settingsToggleButton}
                    // sx={[
                    //     {
                    //         marginLeft: 'auto',
                    //     },
                    // ]}
                >
                </Input>
                <button type="submit" onClick={(e) => handleUploadNewFEN(fenToUpload, e)}>
                    <CheckIcon fontSize='small'/>
                </button>
            </div>
        </>
    )
}

export const UploadDialog = (props: UploadModalProps) => {
    const UploadModal = usePortal(UploadContent);

    return <UploadModal {...props} />;
}

interface DownloadModalProps {
    onClosePortal: () => void; // MouseEventHandler<HTMLDivElement>;
    // onUpdateSettings: (key: string, newValue?: any) => void;
    // onSubmitNewFEN: (newFEN: string, event?: React.SyntheticEvent) => void;
    // put togglable settings here 
    // enableDragAndDrop?: boolean;
    // highlightLegalMoves?: boolean;
    currentFEN: string;
}

export const DownloadContent: React.FC<DownloadModalProps> = (props: DownloadModalProps) => {
    // const [fenToUpload, setFenToUpload] = React.useState<string>('');

    const handleDownloadNewFEN = (event?: React.SyntheticEvent) => {
        console.log(`Downloading current FEN: ${props.currentFEN}`);
        // if (props.onSubmitNewFEN) props.onSubmitNewFEN(newFEN, event);
    }

    return (
        <>
            <div>
                <strong>Current FEN:</strong> 
                {/* style={{marginRight: 'auto'}} */}
                <span>
                    <pre 
                        // value={fenToUpload} 
                        // onChange={(e) => setFenToUpload(e.target.value)}
                        className={styles.settingsToggleButton}
                        // sx={[
                        //     {
                        //         marginLeft: 'auto',
                        //     },
                        // ]}
                    >
                        {props.currentFEN}
                    </pre>
                </span>
                <button type="submit" onClick={() => handleDownloadNewFEN()}>
                    <ContentCopy fontSize='small'/>
                </button>
            </div>
        </>
    )
}

export const DownloadDialog = (props: DownloadModalProps) => {
    const DownloadModal = usePortal(DownloadContent);

    return <DownloadModal {...props} />;
}