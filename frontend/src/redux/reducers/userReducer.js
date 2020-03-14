import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  MARK_NOTIFICATIONS_READ,
  ADD_FRIEND,
  REMOVE_FRIEND
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
  friends: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            screamId: action.payload.screamId
          }
        ]
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.screamId !== action.payload.screamId
        )
      };
    case ADD_FRIEND:
      let newstate = {
        ...state,
        credentials: {
          ...state.credentials,
          friends: [
            ...state.credentials.friends,
            action.payload.friend
          ]
        }
      };
      console.log('friend added', newstate)
      return newstate;
    case REMOVE_FRIEND:
      let _newstate = {
        ...state,
        credentials: {
          ...state.credentials,
          friends: [
            state.credentials.friends.filter(
              (friend) => friend !== action.payload.friend
            )
          ]
        }
      };
      console.log('friend removed', _newstate)
      return _newstate;
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state
      };
    default:
      return state;
  }
}
