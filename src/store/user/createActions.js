import * as Types from './actionTypes';
import axios from 'axios';

export const incrementAge = () => {
  return {
    type: Types.SET_INCREMENT_AGE
  }
};

export const getSchoolList = () => {
  return (dispatch) => {
    return axios.get('http://localhost:8758/api/getSchoolList').then(res => {
      if (res.status === 200) {
        let schoolList = res.data.schoolList;
        console.log(res.data);
        dispatch({
          type: Types.GET_SCHOOL_LIST,
          payload: schoolList
        });
      }
    });
  }
}
