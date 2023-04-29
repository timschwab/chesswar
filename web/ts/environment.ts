const hostname = window.location.hostname;

let env = "remote";
if (hostname == "localhost") {
	env = "local";
}

export default env;
