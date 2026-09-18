# GeoSimse — Agent Instructions

## Project Overview

GeoSim is a real-time simulated world containing autonomous characters.

The application consists of:

- A Next.js frontend for visualising the world
- A persistent Node.js backend running the simulation
- Shared TypeScript types
- Apple MapKit JS for map visualisation

The backend is the source of truth for the simulation.

## Architecture

### Client

Location:

`client/`

Technology:

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Compiler
- Apple MapKit JS

The client is responsible for:

- Rendering the map
- Displaying characters and locations
- Displaying character information
- Animating movement
- Requesting data from the backend

The client must NOT contain the authoritative simulation state.

### Server

Location:

`server/`

Technology:

- Node.js
- TypeScript
- Express

The server is responsible for:

- Maintaining the simulation state
- Advancing simulation time
- Managing characters
- Managing locations
- Managing schedules
- Processing character movement
- Processing future events
- Providing APIs to clients

The simulation must run continuously while the server is running.

Do not use AWS Lambda for the simulation.

### Shared

Location:

`shared/`

Shared TypeScript types and constants should be placed here when they are required by both the client and server.

Avoid duplicating types between the client and server.

## Simulation Principles

The backend owns the world state.

A character should have properties such as:

- id
- name
- age
- home
- workplace
- current location
- destination
- status
- schedule

Characters should eventually be capable of:

- Going to work
- Going home
- Eating
- Shopping
- Visiting locations
- Travelling
- Socialising
- Making decisions

The simulation should be deterministic where practical.

Avoid coupling simulation logic to HTTP request handlers.

## Movement

The backend should not continuously send position updates every second.

Prefer representing movement as:

- origin
- destination
- departure time
- arrival time

The frontend can interpolate the character's position between these points.

This reduces unnecessary network traffic and allows multiple clients to observe the same simulation.

## API

API routes should expose only the information the client needs.

Example:

`GET /api/world`

Returns:

- simulation time
- current people
- relevant locations
- current movement information

Example:

`GET /api/people/:id`

Returns detailed information about a specific person.

Keep API models separate from internal simulation models when necessary.

## Real-Time Communication

Initially, HTTP polling is acceptable.

The long-term architecture should use WebSockets so the server can push world updates to connected clients.

The simulation itself must remain independent of the WebSocket implementation.

## Database

Initially, simulation state can be held in memory.

Do not introduce a database until persistence is actually required.

When persistence is introduced, prefer a relational database such as PostgreSQL because the world contains relationships between:

- people
- homes
- workplaces
- locations
- schedules
- relationships
- events

## Frontend Principles

Use React components with clear responsibilities.

Prefer:

- Server Components where appropriate
- Client Components only when interactivity/browser APIs require them
- React Compiler
- TypeScript
- Tailwind CSS

Avoid unnecessary global state.

The map should be treated as a visualisation of the simulation rather than the simulation itself.

## Code Quality

- Use TypeScript.
- Avoid `any` unless absolutely necessary.
- Prefer small, focused modules.
- Keep simulation logic independent from Express.
- Keep API handlers thin.
- Avoid putting business logic inside React components.
- Use meaningful names.
- Prefer composition over large monolithic classes.
- Keep configuration in environment variables.
- Never commit secrets.

## Project Structure

Preferred structure:

```text
living-world/
├── AGENTS.md
├── package.json
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── public/
├── server/
│   └── src/
│       ├── api/
│       ├── simulation/
│       ├── world/
│       └── index.ts
└── shared/
    └── src/
```
