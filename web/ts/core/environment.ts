export enum Environment {
	REMOTE,
	LOCAL
}

const hostname = globalThis.location.hostname;
const env: Environment = hostname == "localhost" ? Environment.LOCAL : Environment.REMOTE;

export default env;
