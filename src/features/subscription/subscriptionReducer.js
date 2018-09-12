import { FETCH_SUBSCRIPTIONS, GET_DISTANCE_MATRIX, GET_FARE } from './subscriptionConstants';

const initialState = {
    subscriptions: [],
    distanceMatrix:{},
    fare:{},
    distance: null,
    duration: null
};

 const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_SUBSCRIPTIONS:
        return {
          ...state,
          subscriptions: action.subscriptions
        };
      case GET_DISTANCE_MATRIX:
        console.log('GET_DISTANCE_MATRIX', action.payload);
        return {
          ...state,
          distanceMatrix:action.payload
        };
      case GET_FARE:
        console.log('GET_FARE', action.payload);
        return {
            ...state,
            fare: action.payload.fare,
            distance: action.payload.distance,
            duration: action.payload.duration
        };
      default:
        return state;
    }
  };

  export default reducer;
