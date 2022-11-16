import axios from 'axios';
import Cookies from 'js-cookie';


const Api = axios.create({

    // set endpoint api
    baseURL: process.env.REACT_APP_BASEURL,

    // set header axios
    headers: {
        "accept" : "application/json",
        "content-type": "application/json"
    }
})

// handle unathenticated
Api.interceptors.response.use(function (response) {
    return response
}, ((error)=>{
    // check if response unathenticated
    if (401 === error.response.status) {
        Cookies.remove('token')

        window.location='/'
    } else {
        // reject promise error
        return Promise.reject(error)
    }
}))

export default Api