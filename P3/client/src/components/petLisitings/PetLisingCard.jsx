import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from "../../assests/default.png"


import axios from 'axios';
import { 
    Card, 
    CardBody, 
    Image, 
    Heading, 
    Text, 
    Divider, 
    ButtonGroup, 
    Stack,
    Button,
    CardFooter 
  } from '@chakra-ui/react';

import PropTypes from 'prop-types';


function PetListingCard(pet){
    const navigate = useNavigate();
    const imageUrl = pet.avatar || defaultImage;

    const [shelter, setShelter] = useState(null);
    useEffect(() => {
        const fetchShelter = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/accounts/petshelter/${pet.shelter}`); // Replace with your actual API URL
                setShelter(response.data.address);
            } catch (error) {
                console.error('Error fetching shelter details:', error);
            }
        };

        if (pet.shelter) {
            fetchShelter();
        }
    }, [pet.shelter]);

    

    const handleMoreInfoClick = (petId) => {
        navigate(`/pet-details/${petId}`);
    };

    return (
        <Card maxW='sm'>
        <CardBody>
            <Image
            src={imageUrl}
            alt={pet.name || 'Pet'}
            borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
            <Heading size='md'>{pet.name}</Heading>
            <Text>
                Age: {pet.age}, {pet.breed}
            </Text>
            <Text color='blue.600' fontSize='2xl'>
                Shelter Location: {shelter}
            </Text>
            </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
            <ButtonGroup spacing='2'>
            <Button variant='solid' colorScheme='blue' onClick={() => handleMoreInfoClick(pet.id)}>
                More info
            </Button>
            <Button variant='ghost' colorScheme='blue'>
                Add to cart
            </Button>
            </ButtonGroup>
        </CardFooter>
        </Card>
    )
}

PetListingCard.propTypes = {
    pet: PropTypes.shape({
      name: PropTypes.string.isRequired,
      breed: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      shelter: PropTypes.number.isRequired, // You might want to define this object more specifically
      avatar: PropTypes.string // Assuming this is a URL
    }).isRequired,
  };
export default PetListingCard