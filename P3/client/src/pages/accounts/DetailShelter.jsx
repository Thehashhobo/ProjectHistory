import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    SimpleGrid
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const ShelterDetailPage = () => {
    const [petShelterDetail, setPetShelterDetail] = useState(null);
    const { petShelterID } = useParams();
    useEffect(() => {
        const getPetShelterDetails = async () => {
            try {
                let accounts_url = 'http://127.0.0.1:8000/accounts/'
                let pet_shelter_detail_get_endpoint = accounts_url + `petshelter/${petShelterID}/`
                const resp = await fetch(pet_shelter_detail_get_endpoint);
                if (resp.ok) {
                    const resp_data = await resp.json();
                    setPetShelterDetail(resp_data);
                }
            } catch (error) {
                console.error('ERROR OCCURED WHEN RETRIEVED SHELTER DETAILS: ', error.message);
            }
        };
        getPetShelterDetails();
    }, [petShelterID]);

    if (!petShelterDetail) {
        return (
            <Box p={4}>
                <Text>Retrieving pet shelter data. Please wait.</Text>
            </Box>
        );
    }
    let formattedPetShelterEmail = petShelterDetail.name.replace(/\s/g, '').toLowerCase() + "@gmail.com";

    return (
        <Box m={8} p={5}>
            <Box p={4} mb={5} bg="#FFFFFF" borderWidth="6px" borderRadius="md" borderColor="#BEE3F8">
                <Heading textAlign="center" color="blue.500">{petShelterDetail.name}</Heading>
                <Text textAlign="center" fontWeight="bold">Shelter Information Page</Text>
            </Box>
            <Box p={3} boxShadow="md" borderWidth="5px" borderRadius="md" mb={4} bg="#FFFFFF" borderColor="#BEE3F8">
                <Text textAlign="center" color="blue.500" fontWeight="bold" fontSize="xl">Mission Statement:</Text>
                <Text textAlign="center"> {petShelterDetail.mission_statement}</Text>
            </Box >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box boxShadow="md" p={3} borderWidth="5px" borderRadius="md" bg="#FFFFFF" borderColor="#BEE3F8">
                    <Text textAlign="center" color="blue.500" fontWeight="bold" fontSize="xl">
                        Address:
                    </Text>
                    <Text textAlign="center"> {petShelterDetail.address}</Text>
                </Box>

                <Box boxShadow="md" p={3} borderWidth="5px" borderRadius="md" bg="#FFFFFF" borderColor="#BEE3F8">
                    <Text textAlign="center" color="blue.500" fontWeight="bold" fontSize="xl">
                        Contact Information:
                    </Text>
                    <Text textAlign="center"> Phone: {petShelterDetail.phone_number}</Text>
                    <Text textAlign="center"> Email: {formattedPetShelterEmail}</Text>
                </Box>
            </SimpleGrid >

        </Box >
    );
};

export default ShelterDetailPage;
