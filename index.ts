import fetch from "node-fetch";
import {baseURL, headers} from "./config";
import {Patient} from "./Interfaces";
import {mapPatientData, mapSinglePatient} from "./mapper";
//
// export const getResourceData = async (
//     resourceType: string,
//     params?: Record<string, string>
// ) => {
//     const url = new URL(`${baseURL}/${resourceType}`);
//     url.search = new URLSearchParams(params).toString();
//
//     const response = await fetch(url.toString(), {
//         headers: { "Accept": "application/fhir+json" },
//     });
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//
//     const bundle: any = await response.json();
//     if (bundle.resourceType === "Bundle" && Array.isArray(bundle.entry)) {
//         return bundle.entry.map((entry: any) => entry.resource);
//     }
//
//     return [];
// };

export const getPatientResourceData = async (
    params?: Record<string, string>
): Promise<Patient[]> => {
    const resourceType = "Patient";
    const url = new URL(`${baseURL}/${resourceType}`);
    url.search = new URLSearchParams(params).toString();
    console.log("URL:", url.toString());
    const response = await fetch(url.toString(), {
        headers: { "Accept": "application/fhir+json" },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const bundle: any = await response.json();
    // console.log("Bundle Response from API:", JSON.stringify(bundle, null, 2)); // <--- ADD THIS LOG

    if (bundle.resourceType === "Bundle" && Array.isArray(bundle.entry)) {
        const mappedPatients = mapPatientData(bundle.entry.map((entry: any) => entry.resource));
        console.log("Mapped Patients Array (before return):", mappedPatients); // <--- ADD THIS LOG
        return mappedPatients;
    } else if (bundle.resourceType === 'Patient') {
        const singlePatient = mapSinglePatient(bundle);
        return singlePatient ? [singlePatient] : [];
    }

    return [];
};


async function main() {
    try {
        const filters = {
            gender: 'male',
            _pretty: 'true',
            _sort: '_lastUpdated',
            _count: '1'
        };

        const patients: Patient[] = await getPatientResourceData(filters);

        console.log("FETCHED PATIENTS USING fetchPatients():");
        console.log(JSON.stringify(patients));
    }
    catch (error) {
        console.error("Error fetching patients:", error);
    }
}

main();