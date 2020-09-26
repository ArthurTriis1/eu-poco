import axios from 'axios'

export default  axios.create({
    baseURL: 'https://nominatim.openstreetmap.org/?addressdetails=1&q='
})