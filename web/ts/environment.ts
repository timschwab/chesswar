const hostname = window.location.hostname;

const env = {
	localhost: "local",
	"chesswar.io": "remote"
}[hostname];

export default env;
