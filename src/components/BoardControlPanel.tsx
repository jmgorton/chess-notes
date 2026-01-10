import React, { MouseEventHandler } from 'react';
import { 
    BoardControlPanelProps, 
    BoardControlPanelState,
} from '../utils/types';
import SettingsDialog, { DownloadDialog, UploadDialog } from './Dialogs';

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
      showDownloadModal: false,
      showShareModal: false,
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
    // console.log(this.state);
    const newState = Object.entries(this.state).map((item, index) => {
      const [key, value] = item;
      if (typeof value === 'boolean') {
        if (key === "showUploadModal") return {[key]: true};
        return {[key]: false};
      } else {
        return {[key]: value};
      }
    });
    // console.log(newState);
    // Object.assign(this.state, ) // merge list of newState objects into one, spread op? 
    this.setState({
      ...this.state,
      showUploadModal: true,
    })
  }

  handleShowDownloadModal = () => {
    this.setState({
      ...this.state,
      showDownloadModal: true,
    })
  }

  handleShowShareModal = () => {
    this.setState({
      ...this.state,
      showShareModal: true,
    })
  }

  handleUploadFEN = (fenToUpload: string, event?: React.SyntheticEvent) => {
    if (event) {
      // if (event instanceof MouseEvent) {
      //   console.log(`Mouse event: ${event}`);
      // } else {
      //   console.log(`Other type of event: ${event}`);
      // }
      // console.log(`FEN to upload: ${fenToUpload}`);
      this.props.onUploadClick(fenToUpload, event);
    } else {
      console.warn(`Input event not found or not applicable: ${event}`);
    }
  }

  handleDownloadFEN: MouseEventHandler<HTMLButtonElement> = (event) => {
    // don't have to call prop, just do the logic here 
  }

  handleShare: MouseEventHandler<HTMLButtonElement> = (event?) => {

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
      showUploadModal: false,
    })
  }

  handleCloseDownload = () => {
    // TODO just close all portals... we should probably make sure only one portal is ever open at a time,
    // shouldn't even really be possible to open more than one in regular use due to the onClickOutside hook, but users can be crafty 
    this.setState({
      ...this.state,
      showDownloadModal: false,
    })
  }

  handleCloseShare = () => {
    // TODO just close all portals... we should probably make sure only one portal is ever open at a time,
    // shouldn't even really be possible to open more than one in regular use due to the onClickOutside hook, but users can be crafty 
    this.setState({
      ...this.state,
      showShareModal: false,
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
              <button onClick={this.handleShowDownloadModal}><DownloadIcon fontSize='small'/></button>
              <button onClick={this.handleShowShareModal}><SendIcon fontSize='small'/></button>
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
                <UploadDialog onClosePortal={this.handleCloseUpload} onSubmitNewFEN={this.handleUploadFEN} currentFEN={this.props.currentFEN}/>
              )
            }
            {
              this.state.showDownloadModal && (
                <DownloadDialog onClosePortal={this.handleCloseDownload} currentFEN={this.props.currentFEN}/>
              )
            }
            {
              this.state.showShareModal && (
                // <UploadDialog onClosePortal={this.handleCloseShare} onSubmitNewFEN={this.handleUploadFEN}/>
                <></>
              )
            }
          </>
        {/* </ClickAwayListener> */}
      </>
    )
  }
}