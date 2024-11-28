import axios from "axios";
const api_url = process.env.API_URL;
// axios.defaults.adapter = require('axios/lib/adapters/http');

const api = {
    async get(url, headers = {}) {
        try {
            const axiosInstance = axios.create({
                baseURL: api_url,
                timeout: 60000, // 60 giây
            });
            console.log(api_url + url);
            const data = await axiosInstance.get(url, { headers: headers });
            // console.log(data)

            return data;
        } catch (e) {
            throw e;
        }
    },

    async post(url, data = {}, headers = {}) {
        try {
            console.log(api_url + url);
            const axiosInstance = axios.create({
                baseURL: api_url,
                timeout: 60000, // 60 giây
            });
            const response = await axiosInstance.post(url, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // const response = await axios.post(api_url + url, data, { headers: headers , timeout: 30000,})
            // await console.log(await response?.data)
            return response;
        } catch (e) {
            console.error(e);
            // console.log(e.response)
            // console.log(e.request)
            // console.log(e.message)
            // console.log( e.config)
            throw e;
        }
    },

    async put(url, data = {}, headers = {}) {
        try {
            let result = await axios.put(api_url + url, data, {
                headers: headers,
            });
            return result;
        } catch (e) {
            throw e;
        }
    },
    async delete(url, data = {}, headers = {}) {
        try {
            console.log(api_url + url);
            let result = await axios.delete(api_url + url, data, headers);

            return result;
        } catch (e) {
            throw e;
        }
    },
};

export default api;
