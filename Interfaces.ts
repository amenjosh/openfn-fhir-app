export type ResourceType = 'Patient' | 'Observation' | 'MedicationRequest';


interface HumanName {
    given?: string[];
    family?: string;
}

export interface Patient {
    id?: string;
    name?: HumanName[];
    gender?: string;
    birthDate?: string;
}