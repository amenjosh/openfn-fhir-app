import {getPatientResourceData} from "./index";
import {Patient} from "./Interfaces";
import fetch from "node-fetch";

jest.mock("node-fetch", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("fetchPatients", () => {
    beforeEach(() => {
        mockedFetch.mockClear();
    });

    it("should successfully fetch and return Patient array", async () => {
        const mockPatientData: Patient[] = [
            {
                gender: "male",
                birthDate: "1999-12-25",
                name: [{ family: "Zhou", given: ["Ziqi"] }],
            },
        ];

        mockedFetch.mockResolvedValue({
            ok: true,
            json: async () => {
                return {resourceType: 'Bundle', entry: mockPatientData.map(patient => ({resource: patient}))};
            },
        } as any);

        const params = {
            gender: "male",
            _pretty: "true",
            _sort: "_lastUpdated",
            _count: "1",
        };
        const patients = await getPatientResourceData(params);


        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch).toHaveBeenCalledWith(
            expect.stringContaining('/Patient?'),
            expect.objectContaining({ headers: { "Accept": "application/fhir+json" } })
        );
        expect(Array.isArray(patients)).toBe(true);
        expect(patients.length).toBeGreaterThan(0);
        expect(patients[0].gender).toEqual("male");
        expect(patients[0].birthDate).toEqual("1999-12-25");
    });


    it("should throw an error for unsuccessful fetch", async () => {
        mockedFetch.mockResolvedValue({
            ok: false,
            status: 404,
        } as any);

        const searchParams = { gender: "male" };

        await expect(getPatientResourceData(searchParams)).rejects.toThrow(
            "HTTP error! status: 404"
        );
        expect(mockedFetch).toHaveBeenCalledTimes(1);
    });
});