import * as Types from './actionTypes';

const initState = {
  name: 'mark',
  age: 18,
  schoolList: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case Types.SET_INCREMENT_AGE:
      return { ...state, age: state.age + 1 };
    case Types.GET_SCHOOL_LIST:
      return { ...state, schoolList: action.payload };
    default:
      return { ...state };
  }
}
