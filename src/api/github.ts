import axios from 'axios';
import { Repo } from '../types';

const GITHUB_API_URL = 'https://api.github.com/orgs/godaddy/repos';

export const fetchRepos = async (): Promise<Repo[]> => {
    const response = await axios.get(GITHUB_API_URL);
    return response.data;
};