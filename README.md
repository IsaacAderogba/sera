# Sera

This repository contains multiple week-long projects that integrate the [ElevenLabs API](https://elevenlabs.io/) in some way.

![Header](site/sera-banner.png)

## Player

The [Music Player](packages/player/README.md) is a simple spotify-like app that uses the ElevenLabs API to generate background music. While basic from a UI perspective, this example involves complex state management and replication across windows, a from-scratch component library, and a CI/CD process that involves smoke testing the app on Mac/Windows/Linux to guarantee that it can successfully auto-update. It wook about a week of work.

![Player](packages/player/site/light-player-generate.png)
Visit the project [README](packages/player/README.md) to learn more.

## Launcher

The [Launcher](packages/launcher/README.md) is a raycast-like panel app that is instantly accessible with the `Command`+`Shift`+`Space` keyboard combination. It demonstrates how sound effects can be quickly generated and pasted into background applications. It's architecturally much simpler than the Music Player as it doesn't involve any state management and reuses the [Radix UI](https://www.radix-ui.com/) component library. It took about a day of work.

![Launcher](packages/launcher/site/dark-launcher-home.png)
Visit the project [README](packages/launcher/README.md) to learn more.

## Editor

The [Editor](packages/editor/README.md) is a project to experiement with some of the toolchain around creating a video editor. Using [remotion](https://www.remotion.dev/), I feel pretty confident that I'd be able to create an editor that rivals the complexity of [Screen Studio](https://screen.studio/). The main challenges were understanding the rendering flow and implementing a timeline is drag-and-drop capable.

![Launcher](packages/editor/site/light-editor-home.png)
Visit the project [README](packages/editor/README.md) to learn more.
