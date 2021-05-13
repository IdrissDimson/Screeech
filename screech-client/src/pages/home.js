import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Screech from '../components/screech/Screech';
import Profile from '../components/profile/Profile';
import ScreechSkeleton from '../util/ScreechSkeleton';

import { connect } from 'react-redux';
import { getScreechs } from '../redux/actions/dataActions';

class home extends Component {
  componentDidMount() {
    this.props.getScreechs();
  }
  render() {
    const { screechs, loading } = this.props.data;
    let recentScreechsMarkup = !loading ? (
      screechs.map(screech => (
        <Screech key={screech.screechId} screech={screech} />
      ))
    ) : (
      <ScreechSkeleton />
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentScreechsMarkup}
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getScreechs: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getScreechs })(home);
