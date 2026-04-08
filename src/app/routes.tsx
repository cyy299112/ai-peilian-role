import { createBrowserRouter } from 'react-router';
import { Outlet } from 'react-router';
import HomePage from './pages/HomePage';
import TrainingSession from './pages/TrainingSession';

function Root() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'training/:trainingId', Component: TrainingSession },
    ],
  },
]);
