import {Patient} from "./Interfaces";

export const mapSinglePatient = (resource: any): Patient | undefined => {
    if (!resource) {
        console.log("Not a Patient Resource or Resource is null/undefined");
        return undefined;
    }
    return {
        gender: resource.gender,
        active: resource.active,
        birthDate: resource.birthDate,
        name: resource.name ? resource.name.map((fhirName: any) => ({
            family: fhirName.family,
            given: fhirName.given,
        })) : undefined,
    };
};
export const mapPatientData = (resources: any[]): Patient[] => {
    return resources.map(mapSinglePatient).filter((patient) => !!patient) as Patient[];
}