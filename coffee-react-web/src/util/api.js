import React from 'react';
import axios from 'axios';
const basicUrl = "http://localhost:8080/api/";
const request = (method = "", url = "", data={}) => {
   return axios({
    url : basicUrl + url,
    method : method,
    data : data
  }).then(res=>{
    return res;
  }).catch(err=>{
    return err;
  })
}

export default request
