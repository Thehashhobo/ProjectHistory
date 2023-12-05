import PetListingCard from "../../components/petLisitings/PetLisingCard";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, GridItem, Select } from "@chakra-ui/react";
import { useMediaQuery } from 'react-responsive'


function PetListingPage() {
    const welcomTextStyle = {
        color: "#b7c8c9",
        padding: "10px",
        fontFamily: "Cambria",
        fontWeight: "bold",
        fontSize : "30px"
      };
    const divStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px',
    };
    
    const filterSortOptionsStyle = {
        width: '20%',
        color: "#b7c8c9",
        border: "5px"
        
    };
    const fetchShelters = async () => {
        let queryString = 'http://127.0.0.1:8000/accounts/petshelter/';
        try {
            const response = await axios.get(queryString);
            const shelterData = response.data.map(shelter => [shelter.id, shelter.name]);
            setShelterList(shelterData);
        } catch (error) {
            console.error('Error fetching shelters:', error);
        }
    };

    useEffect(() => {
        fetchShelters();
    }, []);

    const [petListings, setPetListings] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const [shelterFilter, setShelterFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [ageSort, setAgeSort] = useState('');
    const [sizeSort, setSizeSort] = useState('');
    const [shelterList, setShelterList] = useState([]);
    
    const fetchPetListings = async () => {
        let queryString = 'http://127.0.0.1:8000/petListing/?';
        const filters = {
            status: statusFilter,
            size: sizeFilter,
            shelter: shelterFilter,
            gender: genderFilter,
        };
    
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                queryString += `${key}=${filters[key]}&`;
            }
        });
    
        if (ageSort) {
            queryString += `ordering=${ageSort === 'descending' ? '-' : ''}age&`;
        }
        if (sizeSort) {
            queryString += `ordering=${sizeSort === 'descending' ? '-' : ''}size&`;
        }
    
        try {
            const response = await axios.get(queryString);
            setPetListings(response.data.results);
        } catch (error) {
            console.error('Error fetching pet listings:', error);
        }
    };
    
    // Call fetchPetListings initially and whenever filter/sort changes
    useEffect(() => {
        fetchPetListings();
    }, [statusFilter, sizeFilter, shelterFilter, genderFilter, ageSort, sizeSort]);

    // Media queries
    const isLargeScreen = useMediaQuery({ query: '(min-width: 1920px)' });
    const isMediumScreen = useMediaQuery({ query: '(min-width: 845px) and (max-width: 1919px)' });
    const isSmallScreen = useMediaQuery({ query: '(max-width: 844px)' });

    let columns;
    if (isLargeScreen) {
        columns = 'repeat(5, 1fr)';
    } else if (isMediumScreen) {
        columns = 'repeat(3, 1fr)';
    } else if (isSmallScreen) {
        columns = 'repeat(2, 1fr)';
    }


    return(
        <>
            <div style={divStyle}>
                <h1 style={welcomTextStyle}>Find them a forever home</h1>
                <div style={filterSortOptionsStyle}>
                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">Filter by Status</option>
                    <option value="available">Available</option>
                    <option value="adopted">Adopted</option>
                    <option value="pending">Pending</option>
                    <option value="unavailable">Unavailable</option>
                </Select>
                <Select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)}>
                    <option value="">Filter by Size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra_large">Extra large</option>
                </Select>
                <Select value={shelterFilter} onChange={e => setShelterFilter(e.target.value)}>
                    <option value="">Filter by Shelter</option>
                    {shelterList.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </Select>
                <Select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                    <option value="">Filter by Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </Select>
                <Select value={ageSort} onChange={e => setAgeSort(e.target.value)}>
                    <option value="">Sort by Age</option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </Select>

                <Select value={sizeSort} onChange={e => setSizeSort(e.target.value)}>
                    <option value="">Sort by Size</option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </Select>
                

                </div>
            </div>

            
            
            <Grid templateColumns={columns} gap={6} justifyContent="center">
            {petListings.map(pet => (
                <PetListingCard key={pet.id} {...pet} /> // Spread operator to pass all pet properties as props
            ))}
            </Grid>
            
        </>
    )

}

export default PetListingPage