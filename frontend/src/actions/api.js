import axios from 'axios';

const config = {
    baseURL: 'http://localhost:4000',
};

export default axios.create(config);