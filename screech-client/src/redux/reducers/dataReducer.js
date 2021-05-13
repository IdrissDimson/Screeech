import {
  SET_SCREECHS,
  LIKE_SCREECH,
  UNLIKE_SCREECH,
  LOADING_DATA,
  DELETE_SCREECH,
  POST_SCREECH,
  SET_SCREECH,
  SUBMIT_COMMENT
} from '../types';

const initialState = {
  screechs: [],
  screech: {},
  loading: false
};

let index;
export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_SCREECHS:
      return {
        ...state,
        screechs: action.payload,
        loading: false
      };
    case SET_SCREECH:
      return {
        ...state,
        screech: action.payload
      };
    case LIKE_SCREECH:
    case UNLIKE_SCREECH:
      index = state.screechs.findIndex(
        screech => screech.screechId === action.payload.screechId
      );
      state.screechs[index] = action.payload;
      if (state.screech.screechId === action.payload.screechId) {
        state.screech = { ...state.screech, ...action.payload };
      }
      return {
        ...state
      };
    case DELETE_SCREECH:
      index = state.screechs.findIndex(
        screech => screech.screechId === action.payload
      );
      state.screechs.splice(index, 1);
      return {
        ...state
      };
    case POST_SCREECH:
      return {
        ...state,
        screechs: [action.payload, ...state.screechs]
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        screech: {
          ...state.screech,
          comments: [action.payload, ...state.screech.comments]
        }
      };
    default:
      return state;
  }
}
