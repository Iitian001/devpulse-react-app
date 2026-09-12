# DevPulse (GitHub Inspector)

A responsive, single-page React application that fetches user profiles and repository data from the GitHub REST API. Users can search for GitHub profiles, filter repositories by language, sort by stars or forks, and pin their favorite repositories to a persistent global pinboard.

## Core Tech Tools Used
- **React.js**: Front-end framework.
- **Vite**: Fast build tool and development server.
- **React Router (react-router-dom)**: Client-side routing and URL state management.
- **GitHub REST API**: Data source for profiles and repositories.
- **React Hooks**: `useState`, `useEffect`, `useContext`, `useReducer`, `useMemo`, `useCallback`.
- **CSS**: Custom styling with variables, flexbox, and grid layout.

## Environment Setup
To run this project locally without hitting GitHub API rate limits quickly, you should provide a GitHub Personal Access Token.
1. Copy `.env.example` to a new file called `.env`.
2. Add your GitHub Personal Access Token to the `.env` file:
   `VITE_API_TOKEN=your_token_here`
3. Run `npm install` and then `npm run dev`.
