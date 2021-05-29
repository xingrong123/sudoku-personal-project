import axios from "axios";

let development = process.env.NODE_ENV !== 'production';

export default axios.create({
  baseURL: development ? 'http://localhost:3002' : ''
});