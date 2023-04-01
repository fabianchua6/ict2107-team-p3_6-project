import React from 'react';
import { ChakraProvider, Container, theme } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WordCloud from './pages/WordCloud';
import NavBar from './components/NavBar';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/wordcloud',
    element: <WordCloud />,
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
