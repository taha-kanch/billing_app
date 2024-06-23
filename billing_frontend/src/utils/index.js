import dayjs from 'dayjs';

export const buildQueryString = (dataToSend) => {

const queryStringArray = Object.entries(dataToSend)
.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)

const queryString = queryStringArray.join('&');
return queryString;

}

export const formatDate = (timestamp) => {

return dayjs(timestamp).format('YYYY-MM-DD');

}