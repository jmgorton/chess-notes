import React from 'react';
import { 
    BoardControlPanelProps, 
    BoardControlPanelState,
} from '../utils/types';
import SettingsDialog, { UploadDialog } from './Dialogs';

import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
// import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SettingsIcon from '@mui/icons-material/Settings';

export default class BoardControlPanel extends React.Component<BoardControlPanelProps, BoardControlPanelState> {

  constructor(props: BoardControlPanelProps) {
    super(props);
    this.state = {
      showSettingsModal: false,
      showUploadModal: false,
    }
  }

  handleShowSettingsModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      ...this.state,
      showSettingsModal: !this.state.showSettingsModal,
    });

    // if (event instanceof React.MouseEvent) 
    this.props.onGetInfoClick(event);
  }

  handleShowUploadModal = () => {
    // this.state.
    console.log(this.state);
    const newState = Object.entries(this.state).map((item, index) => {
      const [key, value] = item;
      if (typeof value === 'boolean') {
        if (key === "showUploadModal") return {[key]: true};
        return {[key]: false};
      } else {
        return {[key]: value};
      }
    });
    console.log(newState);
    this.setState({
      ...this.state,
      showUploadModal: true,
    })
  }

  handleUploadFEN = (fenToUpload: string, event?: React.SyntheticEvent) => {
    if (event && event instanceof MouseEvent) {
      console.log(`FEN to upload: ${fenToUpload}`);
      // this.props.onUploadClick(event)
    }
  }

  handleCloseSettings = () => {
    // TODO just close all portals... we should probably make sure only one portal is ever open at a time,
    // shouldn't even really be possible to open more than one in regular use due to the onClickOutside hook, but users can be crafty 
    this.setState({
      ...this.state,
      showSettingsModal: false,
    })
  }

  handleCloseUpload = () => {
    // TODO just close all portals... we should probably make sure only one portal is ever open at a time,
    // shouldn't even really be possible to open more than one in regular use due to the onClickOutside hook, but users can be crafty 
    this.setState({
      ...this.state,
      showSettingsModal: false,
    })
  }

  render() {
    let modifiableSettings: Partial<BoardControlPanelProps> = {}; // TODO get all the props in common between BoardControlPanel and SettingsDialog
    modifiableSettings.enableDragAndDrop = this.props.enableDragAndDrop;
    modifiableSettings.highlightLegalMoves = this.props.highlightLegalMoves;
    return (
      <>
        {/* <ClickAwayListener onClickAway={this.handleCloseSettings}> */}
          <>
            <div className="board-control-panel">
              <button onClick={this.handleShowSettingsModal}><SettingsIcon fontSize='small'/></button>
              <button onClick={this.handleShowUploadModal}><UploadIcon fontSize='small'/></button>
              <button onClick={this.props.onFlipBoard}><SwapVertIcon fontSize='small'/></button>
              <button onClick={this.props.onDownloadClick}><DownloadIcon fontSize='small'/></button>
              <button onClick={this.props.onSendGameClick}><SendIcon fontSize='small'/></button>
            </div>
            {
              this.state.showSettingsModal && (
                <SettingsDialog 
                  onClosePortal={this.handleCloseSettings}
                  onUpdateSettings={this.props.onUpdateSettings}
                  // enableDragAndDrop={this.props.enableDragAndDrop}
                  // highlightLegalMoves={this.props.highlightLegalMoves}
                  {...modifiableSettings}
                />
              )
            }
            {
              this.state.showUploadModal && (
                <UploadDialog onClosePortal={this.handleCloseUpload} onSubmitNewFEN={this.handleUploadFEN}/>
              )
            }
          </>
        {/* </ClickAwayListener> */}
      </>
    )
  }
}