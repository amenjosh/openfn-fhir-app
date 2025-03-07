import fetch from "node-fetch";
import type { ResourceType } from './Interfaces';
import {headers,baseURL} from "./config";


export const getResourceData = async (resourceType: ResourceType, params?: Record<string,string>) => {
    const url = new URL(`${baseURL}/${resourceType}`);

    const urlSearchParams = new URLSearchParams(params);
    url.search = urlSearchParams.toString();

    console.log("DEBUG: URL =", url.toString());
    console.log("DEBUG: fetch function =", fetch);

    const response = await fetch(url.toString(), {
        headers,
    });

    console.log("DEBUG: response =", response);

    if (!response || !response.ok) {
        console.error("DEBUG: Received undefined or bad response", response);
        throw new Error(`HTTP error! status: ${response ? response.status : 'undefined'}`);
    }

    return response.json();
};

const filters = {
    gender: 'male',
    _pretty: 'true',
    _sort: '_lastUpdated',
    _count: '1'
};

getResourceData('Patient',filters).then((data) => {
    console.log(JSON.stringify(data));
});
