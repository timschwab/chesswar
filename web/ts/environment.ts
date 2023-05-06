export enum Environment {
	REMOTE,
	LOCAL
}

const hostname = window.location.hostname;
const env: Environment = hostname == "localhost" ? Environment.LOCAL : Environment.REMOTE;

export default env;
