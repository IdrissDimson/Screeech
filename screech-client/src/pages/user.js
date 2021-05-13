import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Screech from '../components/screech/Screech';
import StaticProfile from '../components/profile/StaticProfile';
import Grid from '@material-ui/core/Grid';

import ScreechSkeleton from '../util/ScreechSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    profile: null,
    screechIdParam: null
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    const screechId = this.props.match.params.screechId;

    if (screechId) this.setState({ screechIdParam: screechId });

    this.props.getUserData(handle);

    axios
      .get(`/user/${handle}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { screechs, loading } = this.props.data;
    const { screechIdParam } = this.state;

    const screechsMarkup = loading ? (
      <ScreechSkeleton />
    ) : screechs === null ? (
      <p> No Screechs from this user </p>
    ) : !screechIdParam ? (
      screechs.map(screech => (
        <Screech key={screech.screechId} screech={screech} />
      ))
    ) : (
      screechs.map(screech => {
        if (screech.screechId !== screechIdParam)
          return <Screech key={screech.screechId} screech={screech} />;
        else
          return (
            <Screech key={screech.screechId} screech={screech} openDialog />
          );
      })
    );

    return (
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {screechsMarkup}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getUserData })(user);
