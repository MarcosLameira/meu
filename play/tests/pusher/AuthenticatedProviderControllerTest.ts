import {AuthenticatedProviderController} from "../../src/pusher/controllers/AuthenticatedProviderController";
// import {JWTTokenManager} from "../../src/pusher/services/JWTTokenManager";
import type {Request, Response, Server} from "hyper-express";

const NOT_A_SECRET = "foo"
class MockAuthenticatedProviderController extends AuthenticatedProviderController<string> {
    promise = Promise.resolve("success")
    lastRequestParameters: string[] = []
    protected getData(roomUrl: string, uuid: string): Promise<string | undefined> {
        this.lastRequestParameters = [roomUrl, uuid]
        return this.promise;
    }

    protected routes(): void {
    }
}

class MockApp {
    getRoutes: Map<string, (req: Request, res: Response) => void> = new Map<string, () => void>()
    options(_endpoint: string, _callback: unknown){
        return
    }
    get(endpoint: string, callback: (req: Request, res: Response) => void) {
        this.getRoutes.set(endpoint, callback)
        return
    }
    simulateRequest(endpoint: string, req: Request, res: Response) {
        const endpointHandler = this.getRoutes.get(endpoint);
        endpointHandler?.call(endpointHandler, req, res)
    }
}

class FakeResponse {
    public lastJsonData: string | undefined
    public lastSentData: string | undefined;
    constructor(private expectedStatus: number) {
    }

    status(status: number) {
        if (status != this.expectedStatus)
            throw new Error(`Expected status ${this.expectedStatus}, got ${status}`)
        return this;
    }
    json(data: string){
        this.lastJsonData = data;
    }
    send(data: string) {
        this.lastSentData = data;
    }
}

class FakeRequest {
    params: object = {}
    constructor(public path_query: string = "", private headers: object = {"Authorization" : NOT_A_SECRET}) {
    }
    header(header: string): string {
        // @ts-ignore
        return this.headers[header];
    }
}

export interface MockAuthTokenData {
    identifier: string;
    accessToken?: string;
    username?: string;
    locale?: string;
}

export class JWTTokenManagerMock {
    // @ts-ignore
    public verifyAdminSocketToken(_token: string): {authorizedRoomIds: string[]} {
        return {authorizedRoomIds:[]}
    }

    // @ts-ignore
    public createAuthToken(identifier: string, _accessToken?: string, username?: string, _locale?: string): string {
        return ""
    }

    public verifyJWTToken(token: string, ignoreExpiration = false): MockAuthTokenData {
        return { identifier: ""}
    }
}

describe("AuthenticatedProviderController", () => {
   let mockApp: MockApp;
   let mockTokenManager: JWTTokenManagerMock;

    beforeEach(()=> {
        mockApp = new MockApp();
        mockTokenManager = new JWTTokenManagerMock();
        spyOn(mockApp, "options")
    })

    function isValidToken(): void {
        spyOn(mockTokenManager, 'verifyJWTToken').and.returnValue({identifier: "avaliduser"});
    }

    it("should setup correct routes and execute getData with given parameters", (done) => {
        isValidToken();
        const subject = new MockAuthenticatedProviderController(
            mockApp as unknown as Server,
            mockTokenManager);

        subject.setupRoutes("/foo/bar");
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockApp.options).toHaveBeenCalledWith("/foo/bar", jasmine.any(Function))

        const req = new FakeRequest("roomUrl=room")
        const res = new FakeResponse(200)

        // @ts-ignore
        mockApp.simulateRequest("/foo/bar", req, res)
        subject.promise.then(()=> {
            expect(res.lastJsonData).toEqual("success")
            expect(subject.lastRequestParameters).toEqual(["room", "avaliduser"])
            done()
        }).catch(error => {
            console.error(error)
        })
    });

    it("should fail if roomUrl is not given", () => {
        isValidToken();
        const subject = new MockAuthenticatedProviderController(
            mockApp as unknown as Server,
            mockTokenManager);

        subject.setupRoutes("/foo/bar");
        const req = new FakeRequest("");
        const res = new FakeResponse(400);

        // @ts-ignore
        mockApp.simulateRequest("/foo/bar", req, res)
        expect(res.lastSentData).toEqual("missing roomUrl URL parameter");
    });

    it("should fail if Authorization header is not given", () => {
        isValidToken();
        const subject = new MockAuthenticatedProviderController(
            mockApp as unknown as Server,
            mockTokenManager);

        subject.setupRoutes("/foo/bar");
        const req = new FakeRequest("",{});
        const res = new FakeResponse(401);

        // @ts-ignore
        mockApp.simulateRequest("/foo/bar", req, res)
        expect(res.lastSentData).toEqual("Undefined authorization header")
    })

    it("should fail if verifyJWTToken fails", () => {
        spyOn(mockTokenManager, 'verifyJWTToken').and.throwError("failed to verify token")
        const subject = new MockAuthenticatedProviderController(
            mockApp as unknown as Server,
            mockTokenManager);

        subject.setupRoutes("/foo/bar");
        const req = new FakeRequest("roomUrl=url");
        const res = new FakeResponse(401);

        // @ts-ignore
        mockApp.simulateRequest("/foo/bar", req, res)
        expect(res.lastSentData).toEqual("Invalid token sent")
    })
})
