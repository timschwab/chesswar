# chesswar

## Links

* https://chesswar.io/
* https://discord.gg/Vu2pjXkXk
* https://www.buymeacoffee.com/pyzaist

## Prereqs

Deno: https://deno.com/manual/getting_started/installation

## Install

```
git clone git@github.com:timschwab/chesswar.git
cd chesswar
```

## Running the api server

```
deno task api
```

## Running the web server

```
deno task build
deno task web
```

## Opening the game

When the api server and the web server are running, go to http://localhost:8357/

## Major things left to implement

* Finish up the WebGL frontend
* Visually tie orders to briefing rooms
* Make a short tutorial somewhere
* [Optional] very simple bots, one for each role
