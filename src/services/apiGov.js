import axios from 'axios'

export default  axios.create({
    baseURL: 'https://server-preserv.netlify.app/.netlify/functions/app'
})