import { getResourceData } from "./index";
import { ResourceType } from "./Interfaces";
import fetch from "node-fetch";

jest.mock("node-fetch", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("getResourceData", () => {
    beforeEach(() => {
        mockedFetch.mockClear();
    });

    it("should successfully fetch and return data", async () => {
        const mockResponseData = {
            resourceType: "Bundle",
            type: "searchset",
            total: 1,
            link: [
                {
                    relation: "self",
                    url: "https://hapi.fhir.org/baseR4/Patient?gender=male&_pretty=true&_sort=_lastUpdated&_count=1",
                },
            ],
            entry: [
                {
                    fullUrl: "https://hapi.fhir.org/baseR4/Patient/676767",
                    resource: {
                        resourceType: "Patient",
                        id: "676767",
                        meta: {
                            versionId: "1",
                            lastUpdated: "2024-03-05T23:19:37.194+00:00",
                            source: "#a946e499364a959b",
                        },
                        identifier: [
                            {
                                system: "http://example.com/fhir/ids",
                                value: "12345",
                            },
                        ],
                        gender: "male",
                    },
                },
            ],
        };

        mockedFetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponseData,
        } as any);

        const resourceType: ResourceType = "Patient";
        const searchParams = {
            gender: "male",
            _pretty: "true",
            _sort: "_lastUpdated",
            _count: "1",
        };

        const data = await getResourceData(resourceType, searchParams);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(data).toEqual(mockResponseData);
    });

    it("should throw an error for unsuccessful fetch", async () => {
        mockedFetch.mockResolvedValue({
            ok: false,
            status: 404,
        } as any);

        const resourceType: ResourceType = "Patient";
        const searchParams = { gender: "male" };

        await expect(getResourceData(resourceType, searchParams)).rejects.toThrow(
            "HTTP error! status: 404"
        );
        expect(mockedFetch).toHaveBeenCalledTimes(1);
    });
});
