import React from 'react';
import { 
    BoardControlPanelProps, 
    BoardControlPanelState,
} from '../utils/types';

import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

export default class BoardControlPanel extends React.Component<BoardControlPanelProps, BoardControlPanelState> {
  render() {
    return (
      <div className="board-control-panel">
        <button onClick={this.props.onUndoClick}><SendIcon fontSize='small'/></button>
        <button onClick={this.props.onRedoClick}><UploadIcon fontSize='small'/></button>
        <button onClick={this.props.onResetClick}><DownloadIcon fontSize='small'/></button>
        <button onClick={this.props.onGetFENClick}><InfoOutlineIcon fontSize='small'/></button>
      </div>
    )
  }
}