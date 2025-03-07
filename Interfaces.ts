export type ResourceType = 'Patient' | 'Observation' | 'MedicationRequest';


export interface HumanName {
    use?: string;
    text?: string;
    family?: string;
    given?: string[];
}
export interface Patient {
    gender: string,
    active?: boolean;
    name?: HumanName[];
    birthDate?: string;
}