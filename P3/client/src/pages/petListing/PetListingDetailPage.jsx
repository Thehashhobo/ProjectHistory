import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from "../../assests/default.png"

function PetListingDetailPage() {
    
    const [pet, setPet] = useState(null);
    const { petId } = useParams();

    const fetchpetdetail = async () => {
        let queryString = 'http://127.0.0.1:8000/PetListing/${petId}';
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
    
    return(
        <>
            <Image
            src={imageUrl}
            alt={pet.name || 'Pet'}
            borderRadius='lg'
            />
        </>

    )

}

export default PetListingDetailPage