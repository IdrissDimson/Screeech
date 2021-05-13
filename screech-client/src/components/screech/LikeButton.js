import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// REdux
import { connect } from 'react-redux';
import { likeScreech, unlikeScreech } from '../../redux/actions/dataActions';

export class LikeButton extends Component {
  likedScreech = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        like => like.screechId === this.props.screechId
      )
    )
      return true;
    else return false;
  };
  likeScreech = () => {
    this.props.likeScreech(this.props.screechId);
  };
  unlikeScreech = () => {
    this.props.unlikeScreech(this.props.screechId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to='/login'>
        <MyButton tip='Like'>
          <FavoriteBorder color='primary' />
        </MyButton>
      </Link>
    ) : this.likedScreech() ? (
      <MyButton tip='Undo like' onClick={this.unlikeScreech}>
        <FavoriteIcon color='primary' />
      </MyButton>
    ) : (
      <MyButton tip='Like' onClick={this.likeScreech}>
        <FavoriteBorder color='primary' />
      </MyButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screechId: PropTypes.string.isRequired,
  likeScreech: PropTypes.func.isRequired,
  unlikeScreech: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeScreech,
  unlikeScreech
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
