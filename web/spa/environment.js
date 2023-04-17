let hostname = window.location.hostname;

let env = {
	localhost: "local",
	"chesswar.io": "remote"
}[hostname];

module.exports = env;
