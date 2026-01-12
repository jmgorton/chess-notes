import React from 'react';

import { IconButton, Input, InputAdornment, SvgIconTypeMap, TextField, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ContentCopy } from '@mui/icons-material';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { usePortal } from './hoc/PortalWrapper';

import styles from '../styles/Portal.module.css';
import { OverridableComponent } from '@mui/material/OverridableComponent';

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
        // console.log(`Uploading new FEN: ${newFEN}`);
        if (props.onSubmitNewFEN) {
            props.onSubmitNewFEN(newFEN, event);
        } else {
            // console.warn(`Prop not found. Props: ${props}`);
        }

        props.onClosePortal();
    }

    return (
        <>
            <div>
                {/* <strong>FEN:</strong>  */}
                {/* style={{marginRight: 'auto'}} */}
                {/* <Input 
                    value={fenToUpload} 
                    onChange={(e) => setFenToUpload(e.target.value)}
                    className={styles.settingsToggleButton}
                    sx={[
                        {
                            // marginLeft: 'auto',
                            marginRight: 'auto',
                        },
                        {
                            width: '77%',
                        }
                    ]}
                >
                </Input> */}
                {/* Input is more bare-bones and low-level, TextField recommended for most common use-cases */}
                {/* Controlling the HTML input:
                    Use slotProps.htmlInput to pass attributes to the underlying <input> element.
                        <TextField slotProps={{ htmlInput: { 'data-testid': '…' } }} />
                    slotProps.htmlInput is not the same as slotProps.input. 
                    slotProps.input refers to the React <Input /> component that's rendered 
                        based on the specified variant prop. 
                    slotProps.htmlInput refers to the HTML <input> element rendered 
                        within that Input component, regardless of the variant. */}
                <TextField 
                    label='FEN (Forsyth-Edwards Notation)'
                    color='secondary'
                    variant='outlined'
                    focused
                    value={fenToUpload} 
                    slotProps={{
                        input: {
                            endAdornment: 
                                <InputAdornment position="end">
                                    <IconButton onClick={(e) => handleUploadNewFEN(fenToUpload, e)}>
                                        <CheckIcon fontSize='small'/>
                                    </IconButton>
                                </InputAdornment>,
                        },
                    }}
                    // disabled
                    onChange={(e) => setFenToUpload(e.target.value)}
                    // className={styles.settingsToggleButton}
                    fullWidth
                /> 
                {/* <button type="submit" onClick={(e) => handleUploadNewFEN(fenToUpload, e)}>
                    <CheckIcon fontSize='small'/>
                </button> */}
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
    const [copyIcon, setCopyIcon] = React.useState<OverridableComponent<SvgIconTypeMap>>(ContentCopy); // <SvgIconTypeMap<{}, "svg">

    const handleDownloadNewFEN = async (event?: React.SyntheticEvent) => {
        // console.log(`Downloading current FEN: ${props.currentFEN}`);
        // if (props.onSubmitNewFEN) props.onSubmitNewFEN(newFEN, event);
        try {
            await navigator.clipboard.writeText(props.currentFEN);
            setCopyIcon(DoneAllIcon);

            setTimeout(() => {
                // turn the copy button label from ContentCopy to a success indicator 
                // TODO: and then after a second or two, **fade** back into ContentCopy (no fade currently)
                setCopyIcon(ContentCopy);
            }, 2000);
        } catch (err) {
            console.warn(`Failed to copy FEN:${props.currentFEN} to clipboard.`);
        }
    }

    // for FormControl > InputLabel ~ OutlinedInput 
    // type={showPassword ? 'text' : 'password'}
    // endAdornment={
    //     <InputAdornment position="end">
    //     <IconButton
    //         aria-label={
    //         showPassword ? 'hide the password' : 'display the password'
    //         }
    //         onClick={handleClickShowPassword}
    //         onMouseDown={handleMouseDownPassword}
    //         onMouseUp={handleMouseUpPassword}
    //         edge="end"
    //     >
    //         {showPassword ? <VisibilityOff /> : <Visibility />}
    //     </IconButton>
    //     </InputAdornment>
    // }

    return (
        <>
            <div>
                {/* <strong>Current FEN:</strong>  */}
                {/* style={{marginRight: 'auto'}} */}
                {/* <span>
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
                </span> */}
                {/* <button type="submit" onClick={() => handleDownloadNewFEN()}>
                    <ContentCopy fontSize='small'/>
                </button> */}
                <TextField 
                    label='Current FEN (Forsyth-Edwards Notation)'
                    color='secondary'
                    variant='outlined'
                    focused
                    value={props.currentFEN} 
                    slotProps={{
                        input: {
                            endAdornment: 
                                <InputAdornment position="end">
                                    <IconButton onClick={handleDownloadNewFEN}>
                                        {/* <ContentCopy fontSize='small'/> */}
                                        {React.createElement(copyIcon, { fontSize: 'small' })}
                                    </IconButton>
                                </InputAdornment>,
                        },
                    }}
                    disabled
                    // onChange={(e) => setFenToUpload(e.target.value)}
                    // className={styles.settingsToggleButton}
                    fullWidth
                /> 
            </div>
        </>
    )
}

export const DownloadDialog = (props: DownloadModalProps) => {
    const DownloadModal = usePortal(DownloadContent);

    return <DownloadModal {...props} />;
}

interface SendGameModalProps {
    onClosePortal: () => void; // MouseEventHandler<HTMLDivElement>;
    // onUpdateSettings: (key: string, newValue?: any) => void;
    // onSubmitNewFEN: (newFEN: string, event?: React.SyntheticEvent) => void;
    // put togglable settings here 
    // enableDragAndDrop?: boolean;
    // highlightLegalMoves?: boolean;
    // currentFEN: string;
}

export const SendGameContent: React.FC<SendGameModalProps> = (props: SendGameModalProps) => {
    // const [fenToUpload, setFenToUpload] = React.useState<string>('');

    const handleSendGame = (event?: React.SyntheticEvent) => {
        // console.log(`Downloading current FEN: ${props.currentFEN}`);
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
                        Do something
                    </pre>
                </span>
                <button type="submit" onClick={() => handleSendGame()}>
                    <ContentCopy fontSize='small'/>
                </button>
            </div>
        </>
    )
}

export const SendGameDialog = (props: SendGameModalProps) => {
    const SendGameModal = usePortal(SendGameContent);

    return <SendGameModal {...props} />;
}