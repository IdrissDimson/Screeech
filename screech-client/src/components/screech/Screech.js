import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import DeleteScreech from './DeleteScreech';
import ScreechDialog from './ScreechDialog';
import LikeButton from './LikeButton';
// MUI Stuff
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';

const styles = {
  card: {
    // display: 'flex',
    width: 'auto',
    marginBottom: 20,
    borderWidth: 'medium'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: '50%'
  },
  content: {
    padding: 25
    // objectFit: 'cover'
  },
  cardContent: {
    width: 'auto',
    flexDirection: 'column'
  }
};

class Screech extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      screech: {
        body,
        createdAt,
        userImage,
        userHandle,
        screechId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScreech screechId={screechId} />
      ) : null;
    return (
      <Card className={classes.card} variant='outlined'>
        <CardHeader
          avatar={
            <Avatar
              alt={userHandle}
              src={userImage}
              className={classes.image}
            />
          }
          action={
            <ScreechDialog
              screechId={screechId}
              userHandle={userHandle}
              openDialog={this.props.openDialog}
            />
          }
          title={
            <Typography component={Link} to={`/${userHandle}`} color='primary'>
              {userHandle}
            </Typography>
          }
          subheader={dayjs(createdAt).fromNow()}
        />

        <CardContent className={classes.content}>
          <Typography variant='body1'>{body}</Typography>
        </CardContent>
        <CardActions>
          <LikeButton screechId={screechId} />
          <span>{likeCount} Likes</span>
          <Link to={`/${userHandle}/screech/${screechId}`}>
            <MyButton tip='comments'>
              <ChatIcon color='primary' />
            </MyButton>
          </Link>
          <span>{commentCount} comments</span>
          {deleteButton}
        </CardActions>
      </Card>
    );
  }
}

Screech.propTypes = {
  user: PropTypes.object.isRequired,
  screech: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Screech));
