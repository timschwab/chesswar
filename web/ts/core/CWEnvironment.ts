import { localApiServerOrigin, remoteApiServerOrigin } from "../../../common/settings.ts";

// Define the two possible environments
enum Environment {
	REMOTE,
	LOCAL
}

export class CWEnvironment {
	private readonly env: Environment;

	constructor() {
		// Compute what environment we are in from the hostname
		const hostname = globalThis.location.hostname;
		this.env = (hostname === "localhost" ? Environment.LOCAL : Environment.REMOTE);
	}

	// Helper function
	private computeSetting<T>(localOption: T, remoteOption: T): T {
		if (this.env === Environment.LOCAL) {
			return localOption;
		} else if (this.env === Environment.REMOTE) {
			return remoteOption;
		}

		throw "Environment was somehow computed as neither local nor remote";
	}

	// The environment-specific settings
	apiOrigin() {
		return this.computeSetting(localApiServerOrigin, remoteApiServerOrigin);
	}
}
