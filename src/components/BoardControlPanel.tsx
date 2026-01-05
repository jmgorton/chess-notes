import React from 'react';
import { 
    BoardControlPanelProps, 
    BoardControlPanelState,
} from '../utils/types';
import CustomSettingsModal from './Settings';

import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
// import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SettingsIcon from '@mui/icons-material/Settings';
import { ClickAwayListener } from '@mui/material';

export default class BoardControlPanel extends React.Component<BoardControlPanelProps, BoardControlPanelState> {

  constructor(props: BoardControlPanelProps) {
    super(props);
    this.state = {
      showSettings: false,
    }
  }

  handleShowSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      ...this.state,
      showSettings: !this.state.showSettings,
    });

    // if (event instanceof React.MouseEvent) 
    this.props.onGetInfoClick(event);
  }

  handleCloseSettings = () => {
    this.setState({
      ...this.state,
      showSettings: false,
    })
  }

  render() {
    return (
      <>
        {/* <ClickAwayListener onClickAway={this.handleCloseSettings}> */}
          <>
            <div className="board-control-panel">
              <button onClick={this.handleShowSettings}><SettingsIcon fontSize='small'/></button>
              <button onClick={this.props.onUploadClick}><UploadIcon fontSize='small'/></button>
              <button onClick={this.props.onFlipBoard}><SwapVertIcon fontSize='small'/></button>
              <button onClick={this.props.onDownloadClick}><DownloadIcon fontSize='small'/></button>
              <button onClick={this.props.onSendGameClick}><SendIcon fontSize='small'/></button>
            </div>
            {
              this.state.showSettings && (
                <CustomSettingsModal 
                  onCloseSettings={this.handleCloseSettings}
                  onUpdateSettings={this.props.onUpdateSettings}
                  enableDragAndDrop={this.props.enableDragAndDrop}
                  highlightLegalMoves={this.props.highlightLegalMoves}
                />
              )
            }
          </>
        {/* </ClickAwayListener> */}
      </>
    )
  }
}