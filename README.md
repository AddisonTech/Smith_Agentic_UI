# Smith Agentic UI

React dashboard for [Smith_Agentic](https://github.com/AddisonTech/Smith_Agentic) -- a multi-agent task execution framework built on CrewAI and FastAPI.

## What it does

Provides a real-time interface for dispatching, monitoring, and reviewing agentic task runs. Connects to the Smith_Agentic backend over WebSocket and REST.

**Pages**
- **Dashboard** -- live run status, recent activity feed
- **New Run** -- configure and dispatch agent crews from saved templates
- **Run Detail** -- streaming task output, step-by-step crew execution log
- **Files** -- browse and download artifacts produced by runs
- **Marketplace** -- browse and import task templates

## Stack

- React 19 + TypeScript
- Tailwind CSS + shadcn/ui primitives
- Framer Motion for transitions
- Zustand for client state
- eact-use-websocket for live run streaming
- Vite

## Setup

`ash
npm install
npm run dev
`

Requires the Smith_Agentic FastAPI backend running on localhost:8000. See [Smith_Agentic](https://github.com/AddisonTech/Smith_Agentic) for backend setup.

## Related

- [Smith_Agentic](https://github.com/AddisonTech/Smith_Agentic) -- FastAPI backend, CrewAI crews, REST + WebSocket API
- [Smith_Agentic_MCP](https://github.com/AddisonTech/Smith_Agentic_MCP) -- MCP server exposing the agent framework as tools

## License

MIT