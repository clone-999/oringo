import { FETCH_DRIVERS } from './driverConstants';

const initialState = {
    drivers: []
};

 const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_DRIVERS:
        return {
          ...state,
          drivers: action.drivers
        };
      default:
        return state;
    }
  };

  export default reducer;
