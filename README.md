# VSCode To Do

The code in this repository is based of the
[How to Code a VSCode Extension](https://www.youtube.com/watch?v=a5DX5pQ9p5M)
video.

## Setup

```bash
npm install -g yo generator-code
yo code # select typescript and npm
```

- delete `./src/test`
- delete contents of `tasks` array in `.vscode/tasks.json`
- delete `preLaunchTask` from `.vscode/launch.json`
- `npm run watch` and then press `F5` to launch the extension
- in the new launched window use SHIFT-CNTL-P run `Hello World`
- in new launched window run S-C-P `Developer: Reload Window` to see latest code
  change or use the Ctrl-R shortcut

## Postgres DB Setup

Details taken form [here](https://hub.docker.com/_/postgres).

```bash
docker stack deploy -c stack.yml postgres
```

- Use the gui to create the `vstodo` database.

## History

- Initially vstodo-ext was create with `yo code` as vstodo.
