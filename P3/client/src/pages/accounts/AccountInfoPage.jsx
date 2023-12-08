import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LogoutButton from '../../components/accounts/LogoutButton';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Center,
    Image,
    Heading,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react';

const AccountInfoPage = () => {

    const user_email = localStorage.getItem('user_email');
    const nav = useNavigate();
    const handleUpdateBtnClick = () => {
        nav('/account-update');
    };
    const handleShelterDetailBtnClick = () => {
        nav(`/pet_shelters/${userInfoData.id}`);
    };
    const [userInfoData, setUserInfoData] = useState({
        id: '',
        user: '',
        name: '',
        password: '',
        password2: '',
        avatar: null,
        mission_statement: '',
        address: '',
        phone_number: '',
    });

    const [isPetShelter, setIsPetShelter] = useState(true);

    useEffect(() => {
        const getCurrentUserInfo = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/accounts/user/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (response.status === 200) {
                    const userInfo = response.data;
                    console.log("USER INFO IS HERE", userInfo)
                    setUserInfoData((prevUserInfoData) => ({
                        ...prevUserInfoData,
                        ...userInfo,
                    }));
                    const getPetShelterBool = localStorage.getItem('is_pet_shelter_user');
                    if (getPetShelterBool !== null) {
                        const parsedPetShelterBool = JSON.parse(getPetShelterBool);
                        setIsPetShelter(parsedPetShelterBool);
                    }

                } else {
                    console.error('ERROR WHEN GETTING USER INFO');
                    console.log("1", response)
                }
            } catch (error) {
                console.error('USER WHEN GETTING USER INFO, ', error);
                console.log("2", error)
            }
        };

        getCurrentUserInfo();
    }, []);

    return (
        <Box>
            <Box m={10} bg="#FFFFFF" mb={10} borderWidth="8px" borderRadius="lg" p={4}>
                <Heading textAlign="center" mb={4}>Welcome <Text color="blue.500">{user_email}!</Text></Heading>
                <Center>
                    <HStack gap={5}>
                        <Box m={2}>
                            <Button onClick={handleUpdateBtnClick}>Update Account</Button>
                        </Box>
                        <LogoutButton />
                        {isPetShelter && (
                            <Box m={2}>
                                <Button onClick={handleShelterDetailBtnClick}>View Shelter Page</Button>
                            </Box>

                        )}
                    </HStack>
                </Center>

            </Box>
            <Box m={10} bg="#FFFFFF" mb={10} borderWidth="8px" borderRadius="lg" p={4}>
                <Text mb={3} textAlign="center" color="blue.500" fontSize='xl' fontWeight="bold"> Account Information</Text>
                <Center>
                    <VStack mb={5}>
                        <Text fontWeight="bold">Name: </Text>
                        <Text textAlign="center">{userInfoData.name}</Text>
                    </VStack>
                </Center>
                {isPetShelter && (
                    <>
                        <Center>
                            <VStack mb={5}>
                                <Text fontWeight="bold">Mission Statement: </Text>
                                <Text textAlign="center">{userInfoData.mission_statement}</Text>
                            </VStack>
                        </Center>
                        <Center>
                            <VStack mb={5}>
                                <Text fontWeight="bold">Address: </Text>
                                <Text textAlign="center">{userInfoData.address}</Text>
                            </VStack>
                        </Center>
                    </>
                )}
                {!isPetShelter && (
                    <Center>
                        {userInfoData.avatar && (
                            <Box mt={4} borderRadius="full"
                                overflow="hidden"
                                boxSize="270px" borderWidth="2px"  >
                                <Image src={userInfoData.avatar} alt={`Profile of ${userInfoData.name}`} width="100%" height="100%" objectFit="cover" mb={4} />
                            </Box>)}
                    </Center>
                )}
            </Box>
        </Box>

    );
};

export default AccountInfoPage;

