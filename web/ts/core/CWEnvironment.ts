import { localApiServerOrigin, remoteApiServerOrigin } from "../../../common/settings.ts";

// Define the two possible environments
enum Environment {
	REMOTE,
	LOCAL,
	UNKNOWN
}

export class CWEnvironment {
	private readonly env: Environment;

	constructor() {
		this.env = this.computeEnvironment();
	}

	private computeEnvironment(): Environment {
		// Compute what environment we are in from the hostname
		const hostname = globalThis.location.hostname;
		if (hostname === "localhost") {
			return Environment.LOCAL;
		} else if (hostname === "chesswar.io") {
			return Environment.REMOTE;
		} else {
			return Environment.UNKNOWN;
		}
	}

	// Helper function
	private computeSetting<T>(localOption: T, remoteOption: T): T {
		if (this.env === Environment.LOCAL) {
			return localOption;
		} else if (this.env === Environment.REMOTE) {
			return remoteOption;
		} else {
			throw "Environment is unknown";
		}
	}

	// The environment-specific settings
	apiOrigin() {
		return this.computeSetting(localApiServerOrigin, remoteApiServerOrigin);
	}
}
