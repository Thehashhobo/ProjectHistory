import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from "../../assests/default.png"
import { Card, Grid, Image, CardBody, Text, GridItem, Divider, Stack, Button, Center} from '@chakra-ui/react';
import { EmailIcon } from "@chakra-ui/icons";
import { useMediaQuery } from 'react-responsive'

function PetListingDetailPage() {
    const navigate = useNavigate();
    const isLargeScreen = useMediaQuery({ query: '(min-width: 1920px)' });
    const isSmallScreen = useMediaQuery({ query: '(max-width: 844px)' });
    let columns;
    if (isLargeScreen) {
        columns = 'repeat(2, 1fr)';
    } else if (isSmallScreen) {
        columns = 'repeat(1, 2fr)';
    }

    const cardstyle = {
        borderColor: "#d9edad",
        borderWidth: "15px",
        

    };
    const gridstyle = {
        display: 'grid',
        gridTemplateRows: 'repeat(1, 1fr)',
        gridTemplateColumns: columns,
        gap: "6px",
        justifyContent: "center",
        padding: "15px",
        borderRadius: "10px"

    };
    const [pet, setPet] = useState(null);
    const { petId } = useParams();


    const fetchpetdetail = async () => {
        let queryString = `http://127.0.0.1:8000/petListing/${petId}/`;
        try {
            const response = await axios.get(queryString);
            setPet(response.data);
        } catch (error) {
            console.error('Error fetching Pet Listing:', error);
        }
    };

    useEffect(() => {
        fetchpetdetail();
    }, [petId]);

    if (!pet) {
        return <div>Loading...</div>;
    }
    const imageUrl = pet.avatar || defaultImage;
    let color;
    if (pet.status === 'pending'){
        color = '#ffc36d'; //yellow
    } else if 
    (pet.status === 'available'){
        color = '#7ae036'; //green
    } else 
    {color = 'red';}
    
    

    const handleApplicationClick = (petId) => {
        navigate(`/pet-details/application/${petId}`);
    };
    return(
        <>
            <Grid style={gridstyle}>
                <GridItem>
                    <Card variant={'outline'} style={cardstyle}>
                        <CardBody>
                            <h1 style={{textAlign:'center', fontSize:"40px"}}>Name: {pet.name}</h1>
                            <Divider />
                            <Image
                                src={imageUrl}
                                alt={pet.name || 'Pet'}
                                borderRadius='lg'
                            />
                            <Text>View a summary of all your customers over the last month. 1</Text>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card style={cardstyle}>
                        <CardBody>
                            <Card style={{backgroundColor: color, borderRadius: '50px', maxWidth: "60%",minWidth: "500px" }}>
                                <Text style={{textAlign:'center', fontSize:"30px", margin: "15px"}}>Adoption Status {pet.status}</Text>
                            </Card>
                            <Stack direction='row' spacing={4} margin={15} justify="center">
                                <Button leftIcon={<EmailIcon />} colorScheme='teal' variant='solid'>
                                    Email
                                </Button>
                                <Button colorScheme='teal' variant='outline' onClick={() => handleApplicationClick(pet.id)}>
                                    Adopt!
                                </Button>
                            </Stack>
                            <Text>View a summary of all your customers over the last month. 2</Text>
                        </CardBody>
                    </Card>
                </GridItem>
                </Grid>
                <h1>{pet.color}</h1>
                
            
        </>

    )

}

export default PetListingDetailPage