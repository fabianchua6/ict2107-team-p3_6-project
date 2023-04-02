import React from 'react';
import { ChakraProvider, Container, theme } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NavBar from './components/NavBar';
import About from './pages/About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/about',
    element: <About />,
  },
]);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <NavBar />
      <Container maxW={'6xl'} py={4}>
        <RouterProvider router={router} />
      </Container>
    </ChakraProvider>
  );
}

export default App;
