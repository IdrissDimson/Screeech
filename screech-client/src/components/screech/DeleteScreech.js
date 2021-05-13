import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

// MUI Stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deleteScreech } from '../../redux/actions/dataActions';

const styles = {
  deleteButton: {}
};

class DeleteScreech extends Component {
  state = {
    open: false
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  deleteScreech = () => {
    this.props.deleteScreech(this.props.screechId);
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <MyButton
          tip='Delete Screech'
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color='secondary' />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='sm'
        >
          <DialogTitle>
            Are you sure you want to delete this Screech?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary' autoFocus>
              Cancel
            </Button>
            <Button onClick={this.deleteScreech} color='secondary'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteScreech.propTypes = {
  deleteScreech: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  screechId: PropTypes.string.isRequired
};

export default connect(null, { deleteScreech })(
  withStyles(styles)(DeleteScreech)
);
