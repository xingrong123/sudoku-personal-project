import axios from "axios";

let development = process.env.NODE_ENV !== 'production';

export default axios.create({
  baseURL: development ? 'http://localhost:3002' : 'postgres://nepiugirwevemu:238854ecfd36e4965de8e9b85e21febae9a73dff1f3aabd1ea503cff924bc074@ec2-3-215-57-87.compute-1.amazonaws.com:5432/d59vo4mskjgrea'
});