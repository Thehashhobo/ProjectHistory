import React, { useState } from 'react';
import axios from 'axios';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [displayError, setDisplayError] = useState(false);
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: '',
    });
    const handleChange = (e) => {
        setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post('http://localhost:8000/accounts/login/', loginFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const access_token = resp.data.access;
            const refresh_token = resp.data.refresh;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            setDisplayError(false);
            navigate('/pet_shelters');
        } catch (error) {
            console.error('LOGIN ERROR:', error.message);
            setDisplayError(true);
        }
    };

    return (
        <Container>
            <Box mt={10} mb={10} bg="#FFFFFF" borderWidth="8px" borderRadius="lg" p={4}>
                <Heading textAlign="center" mb={4}>Login to <Text color="blue.500">Barnyard Buddies</Text></Heading>
                {displayError && (
                    <Alert status="error" borderRadius="lg" mb={4}>
                        <AlertIcon />
                        Invalid email or password. Please try again.
                    </Alert>
                )}
                <Text fontsize="md" align="center" pb={4}>Do not have an account? <Link color="blue.500" href="/register">Register!</Link></Text>
                <form onSubmit={handleSubmit}>
                    <FormControl mb={4}>
                        <FormLabel>Email:</FormLabel>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={loginFormData.email}
                            onChange={handleChange}
                            required
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Password:</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={loginFormData.password}
                            onChange={handleChange}
                            required
                        />
                    </FormControl>
                    <Center>
                        <Button type="submit" colorScheme="blue" isFullWidth="true">
                            Login
                        </Button>
                    </Center>
                </form>
            </Box>
        </Container>
    );
};

export default LoginPage;