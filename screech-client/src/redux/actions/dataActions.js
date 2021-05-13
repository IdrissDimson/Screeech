import {
  SET_SCREECHS,
  LOADING_DATA,
  LIKE_SCREECH,
  UNLIKE_SCREECH,
  DELETE_SCREECH,
  SET_ERRORS,
  POST_SCREECH,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_SCREECH,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

// Get all Screechs
export const getScreechs = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/screechs')
    .then(res => {
      dispatch({
        type: SET_SCREECHS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_SCREECHS,
        payload: []
      });
    });
};
export const getScreech = ScreechId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/screech/${ScreechId}`)
    .then(res => {
      dispatch({
        type: SET_SCREECH,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};
// Post a Screech
export const postScreech = newScreech => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/screech', newScreech)
    .then(res => {
      dispatch({
        type: POST_SCREECH,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
// Like a Screech
export const likeScreech = ScreechId => dispatch => {
  axios
    .get(`/screech/${ScreechId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_SCREECH,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
// Unlike a Screech
export const unlikeScreech = ScreechId => dispatch => {
  axios
    .get(`/screech/${ScreechId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_SCREECH,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
// Submit a comment
export const submitComment = (screechId, commentData) => dispatch => {
  axios
    .post(`/screech/${screechId}/comment`, commentData)
    .then(res => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
export const deleteScreech = screechId => dispatch => {
  axios
    .delete(`/screech/${screechId}`)
    .then(() => {
      dispatch({ type: DELETE_SCREECH, payload: screechId });
    })
    .catch(err => console.log(err));
};

export const getUserData = userHandle => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then(res => {
      dispatch({
        type: SET_SCREECHS,
        payload: res.data.screechs
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SCREECHS,
        payload: null
      });
    });
};

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
