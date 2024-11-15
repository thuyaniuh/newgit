import axios from 'axios'
const api_url = process.env.API_URL

const api = {
    async get(url, headers = {}) {
        try {
            const data = await axios.get(api_url + url, { headers: headers })
            console.log(api_url + url)
            // console.log(data)

            return await data
        } catch (e) {
            throw e
        }
    },

    async post(url, data = {}, headers = {}) {
        try {
            console.log(api_url + url)
            const response = await axios.post(api_url + url, data, { headers: headers, timeout: 15000 })
            // await console.log(await response?.data)
            return response
        } catch (e) {
            // console.log(e.response)
            // console.log(e.request)
            // console.log(e.message)
            // console.log( e.config)
            throw e
        }
    },

    async put(url, data = {}, headers = {}) {
        try {
            let result = await axios.put(api_url + url, data, { headers: headers });
            return result;
        } catch (e) {
            throw e;
        }
    },
    async delete(url, data = {}, headers = {}) {
        try {
            console.log(api_url + url)
            let result = await axios.delete(api_url + url, data, headers)

            return result
        } catch (e) {
            throw e
        }
    }
}

export default api
