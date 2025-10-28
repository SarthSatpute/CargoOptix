# CargoOptix - 3D Ship Load Optimization Dashboard

A production-ready, cinematic 3D visualization dashboard for container ship load optimization. Built with Next.js, React Three Fiber, and TailwindCSS.

## Features

- **3D Ship Visualization**: Real-time 3D rendering of container placements using React Three Fiber
- **Stability Metrics**: Live GM (Metacentric Height) gauge and stability analysis
- **Cargo Distribution**: Visual breakdown of cargo types (general, reefer, hazmat)
- **Playback Controls**: Step through placements with adjustable playback speed
- **Demo Mode**: Pre-loaded sample scenarios for testing without backend
- **Export Functionality**: Download results as JSON/CSV
- **Responsive Design**: Glassmorphism UI with dark theme
- **Accessibility**: ARIA labels, keyboard navigation, high-contrast mode

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **3D Graphics**: React Three Fiber, Three.js, @react-three/drei
- **State Management**: Zustand
- **Data Fetching**: Axios, React Query
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: react-icons

## Getting Started

### Installation

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_BASE=http://localhost:3001
NEXT_PUBLIC_DEMO_MODE=true
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## API Integration

The app expects the following API endpoints:

### GET /api/scenarios

Returns list of available scenarios:

\`\`\`json
{
  "scenarios": [
    {
      "id": 1,
      "containers": 632,
      "teu": 762,
      "sea_state": "moderate",
      "utilization": 0.84
    }
  ]
}
\`\`\`

### POST /api/optimize

Optimizes a scenario and returns placement results:

\`\`\`json
{
  "success": true,
  "scenario_id": 1,
  "metrics": { ... },
  "placed": [ ... ],
  "failed": [ ... ],
  "placement_log": [ ... ]
}
\`\`\`

See `public/sample_response.json` for full response schema.

## Project Structure

\`\`\`
/src
  /components
    - PageLayout.tsx
    - Header.tsx
    - Footer.tsx
    - LeftPanel.tsx
    - RightPanel.tsx
    - ThreeCanvas.tsx
    - ShipScene.tsx
    - ShipHull.tsx
    - ContainerInstancer.tsx
    - GMGauge.tsx
    - PlacementStats.tsx
    - CargoPieChart.tsx
    - ScenarioSelector.tsx
    - PlaybackControls.tsx
  /lib
    - store.ts (Zustand state)
    - api.ts (Axios wrapper)
  /app
    - page.tsx
    - layout.tsx
    - globals.css
  /public
    - sample_response.json

\`\`\`

## Performance Optimization

- **Instanced Rendering**: Uses `InstancedMesh` for efficient container rendering (600+ containers at 60fps)
- **LOD System**: Simplified geometry for large container counts
- **Frustum Culling**: Automatic camera-based culling
- **DPR Control**: Adaptive pixel ratio for low-end devices
- **Lazy Loading**: Components load with Suspense boundaries

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

\`\`\`bash
vercel deploy
\`\`\`

## TODO / Future Enhancements

- [ ] Implement playback animation timeline
- [ ] Add container detail modal on click
- [ ] Implement undo/retry functionality
- [ ] Add voice narration for demo mode
- [ ] Create PDF export with screenshots
- [ ] Add before/after comparison slider
- [ ] Implement heatmap overlay
- [ ] Add keyboard shortcuts guide
- [ ] Create unit tests for core components
- [ ] Add WebGL performance monitoring

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support.
