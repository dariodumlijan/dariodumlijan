import { createBrowserRouter } from 'react-router-dom';
import BusinessCard from './components/pages/BusinessCard';
import Home from './components/pages/Home';

const router = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/business-card',
    element: <BusinessCard />,
  },
];

export default createBrowserRouter(router);
