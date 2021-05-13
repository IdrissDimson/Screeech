import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// MUI Stuff
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';
// Redux stuff
import { connect } from 'react-redux';
import { getScreech, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
  ...theme.spreadIt,
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  profileImage: {
    maxWidth: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  imageDiv: {},
  dialogContent: {
    padding: 20
  },
  closeButton: {
    float: 'right'
  },
  expandButton: {
    // position: 'absolute',
    // left: '90%'
  },
  spinnerDiv: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50
  },
  linkButton: {
    color: theme.palette.primary.main
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, userImage, subheader, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <CardHeader
        avatar={
          <img src={userImage} alt='Profile' className={classes.profileImage} />
        }
        action={
          <MyButton
            tip='Close'
            onClick={onClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
        }
        title={
          <Typography variant='h5' color='textSecondary'>
            {children}
          </Typography>
        }
        subheader={subheader}
      />
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    justifyContent: 'flex-start'
  }
}))(MuiDialogActions);

const ScreechDialog = withStyles(styles)(props => {
  const [open, setOpen] = useState(false);
  let [oldPath, setOldPath] = useState('');

  const {
    classes,
    screech: {
      body,
      createdAt,
      userImage,
      userHandle,
      screechId,
      likeCount,
      comments,
      commentCount
    },
    UI: { loading }
  } = props;

  const handleOpen = () => {
    let handleOldPath = window.location.pathname;

    const { userHandle, screechId } = props;
    const handleNewPath = `/${userHandle}/screech/${screechId}`;

    if (handleOldPath === handleNewPath) handleOldPath = `/${userHandle}`;

    window.history.pushState(null, null, handleNewPath);

    setOpen(true);
    setOldPath(handleOldPath);
    props.getScreech(props.screechId);
  };
  const handleClose = () => {
    setOpen(false);
    window.history.pushState(null, null, oldPath);
    props.clearErrors();
  };
  useEffect(() => {
    if (props.openDialog) {
      handleOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dialogMarkup = loading ? (
    <div className={classes.spinnerDiv}>
      <CircularProgress size={200} thickness={2} />
    </div>
  ) : (
    <div>
      <DialogTitle
        onClose={handleClose}
        userImage={userImage}
        subheader={dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
      >
        {/* <div className={classes.imageDiv}>
          <img src={userImage} alt='Profile' className={classes.profileImage} />
        </div> */}
        <Link className={classes.linkButton} to={`/${userHandle}`}>
          @{userHandle}
        </Link>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <hr className={classes.invisibleSeparator} />
        <Typography variant='body1'>{body}</Typography>
      </DialogContent>
      <DialogActions>
        <LikeButton screechId={screechId} />
        <span>{likeCount} likes</span>
        <MyButton tip='comments'>
          <ChatIcon color='primary' />
        </MyButton>
        <span>{commentCount} comments</span>
      </DialogActions>
      <hr className={classes.visibleSeparator} />
      <CommentForm screechId={screechId} />
      <Comments comments={comments} />
    </div>
  );
  return (
    <Fragment>
      <MyButton
        onClick={handleOpen}
        tip='Expand Screech'
        tipClassName={classes.expandButton}
      >
        <UnfoldMore color='primary' />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        {dialogMarkup}
      </Dialog>
    </Fragment>
  );
});

ScreechDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getScreech: PropTypes.func.isRequired,
  screechId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  screech: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  screech: state.data.screech,
  UI: state.UI
});

const mapActionsToProps = {
  getScreech,
  clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(ScreechDialog);
