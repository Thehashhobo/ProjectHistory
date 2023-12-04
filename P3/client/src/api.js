import axios from 'axios';
import { SAMPLE_USER_ID } from './constants';

const api_url = "http://localhost:3000/";

export const getCurrentUser = async () => {
    const userId = localStorage.getItem('userId') || SAMPLE_USER_ID;
  
    const result = await axios.get(`${api_url}contributor/${userId}`);
  
    return result.data;
  };