import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PetListingPage from './pages/petListing/PetListingPage.jsx';
import PetListingDetailPage from './pages/petListing/PetListingDetailPage.jsx';
import {
  Home,
} from './pages';
import Layout from './components/Layout';
import RegistrationPage from './pages/accounts/Register.jsx';
import LoginPage from './pages/accounts/Login.jsx';
import ListingPetSheltersPage from './pages/accounts/ListingShelters.jsx';
import ShelterDetailPage from './pages/accounts/DetailShelter.jsx';
import AccountInfoPage from './pages/accounts/AccountInfoPage.jsx';
import PetPalUserUpdatePage from './pages/accounts/PetPalUserUpdatePage.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/pet-listings', // path to Petlisting List
        element: <PetListingPage />,
      },
      {
        path: '/pet-details/:petId', // path to Pet detail List
        element: <PetListingDetailPage />,
      },
      {
        path: "/register",
        element: <RegistrationPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/pet_shelters",
        element: <ListingPetSheltersPage />,
      },
      {
        path: "/pet_shelters/:petShelterID",
        element: <ShelterDetailPage />,
      },
      {
        path: '/pet-details/application/:petId', // path to Pet detail List
        element: <Home />, // change element to your application page(if you are using page,but i think pop up might be better) 
        //and use const { petId } = useParams(); to grab petId
      },
      {
        path: '/account-information',
        element: <AccountInfoPage />,
      },
      {
        path: '/account-update',
        element: <PetPalUserUpdatePage />
      },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router}>
        </RouterProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;