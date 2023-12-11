import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Avatar,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Grid
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Rating from '../../components/comments/stars';
import RatingModal from '../../components/comments/rating';
import useFetchPetListings from "../../hooks/FetchPetListings";
import { useMediaQuery } from 'react-responsive'
import PetListingCard from "../../components/petListings/PetListingCard";




const ShelterDetailPage = () => {
  const [petShelterDetail, setPetShelterDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const { petShelterID } = useParams();
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1920px)' });
  const isMediumScreen = useMediaQuery({ query: '(min-width: 845px) and (max-width: 1919px)' });
  const isSmallScreen = useMediaQuery({ query: '(max-width: 844px)' });
  const [isPetShelter, setIsPetShelter] = useState(true);

  let columns;
  if (isLargeScreen) {
    columns = 'repeat(5, 1fr)';
  } else if (isMediumScreen) {
    columns = 'repeat(3, 1fr)';
  } else if (isSmallScreen) {
    columns = 'repeat(2, 1fr)';
  }
  const petListings = useFetchPetListings(
    {
      status: '',
      size: '',
      shelter: petShelterID,
      gender: ''
    },
    {
      age: '',
      size: ''
    }
  );
  const [newComment, setNewComment] = useState({
    comment_text: '',
    rating: 0,
  });
  const handleRatingChange = (newRating) => {
    setNewComment({ ...newComment, rating: newRating });
  };

  const calculateAverageRating = (comments) => {
    const filteredComments = comments.filter(
      (comment) => comment.rating !== null
    );

    if (filteredComments.length === 0) {
      return 0;
    }

    const totalRating = filteredComments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );

    return totalRating / filteredComments.length;
  };

  function formatReadableDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });
  }

  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastCommentRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreComments();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const loadMoreComments = async () => {
    try {
      let nextPage = 2;

      while (true) {
        const additionalCommentsEndpoint = `http://127.0.0.1:8000/comments/shelters/${petShelterID}/?page=${nextPage}`;
        const additionalCommentsResp = await fetch(additionalCommentsEndpoint);

        if (additionalCommentsResp.ok) {
          const additionalCommentsData = await additionalCommentsResp.json();
          if (
            additionalCommentsData.results &&
            Array.isArray(additionalCommentsData.results)
          ) {
            setComments((prevComments) => [
              ...prevComments,
              ...additionalCommentsData.results,
            ]);

            if (additionalCommentsData.next) {
              nextPage++;
            } else {
              setHasMore(false); // Update hasMore to false when there are no more comments
              break;
            }
          } else {
            console.error(
              'Invalid additional comments data:',
              additionalCommentsData
            );
            break;
          }
        } else {
          console.error(
            'Error fetching additional comments:',
            additionalCommentsResp.status
          );
          const errorData = await additionalCommentsResp.json();
          console.error('Server error details:', errorData);
          break;
        }
      }
    } catch (error) {
      console.error('Error fetching additional comments:', error.message);
    }
  };

  useEffect(() => {
    const getPetShelterDetails = async () => {
      try {
        let accounts_url = 'http://127.0.0.1:8000/accounts/';
        let pet_shelter_detail_get_endpoint =
          accounts_url + `petshelter/${petShelterID}/`;
        const resp = await fetch(pet_shelter_detail_get_endpoint);
        if (resp.ok) {
          const resp_data = await resp.json();
          setPetShelterDetail(resp_data);
          const getPetShelterBool = localStorage.getItem('is_pet_shelter_user');
          if (getPetShelterBool !== null) {
            const parsedPetShelterBool = JSON.parse(getPetShelterBool);
            setIsPetShelter(parsedPetShelterBool);
            console.log("PET SHELER OR NOT:", parsedPetShelterBool)
          }

          const commentsEndpoint = `http://127.0.0.1:8000/comments/shelters/${petShelterID}/`;
          const commentsResp = await fetch(commentsEndpoint);

          if (commentsResp.ok) {
            const commentsData = await commentsResp.json();
            if (commentsData.results && Array.isArray(commentsData.results)) {
              setComments(commentsData.results);
              setTotalReviews(commentsData.count);
            } else {
              console.error('Invalid comments data:', commentsData);
            }
          }
        } else {
          window.location.href = "/page-not-found"
        }
      } catch (error) {
        console.error(
          'ERROR OCCURRED WHEN RETRIEVING SHELTER DETAILS: ',
          error.message
        );
        window.location.href = "/page-not-found"
      }
    };

    getPetShelterDetails();
  }, [petShelterID]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleCommentSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const user_user = localStorage.getItem('user_user');
      const user_id = localStorage.getItem('user_id');
      const user_name = localStorage.getItem('user_name');
      const is_pet_shelter_user = localStorage.getItem('is_pet_shelter_user');

      if (!accessToken) {
        console.error('Access token not found.');
        return;
      }

      let payload;

      if (is_pet_shelter_user === 'true') {
        payload = {
          comment_made_by_the_user: user_user,
          object_id: petShelterID,
          content_type: petShelterID,
          comment_text: newComment.comment_text,
          comment_made_by_the_id_pet_seeker: null,
          comment_made_by_the_id_pet_shelter: user_id,
          rating: newComment.rating,
          is_application: false,
          name: user_name,
        };
      } else {
        payload = {
          comment_made_by_the_user: user_user,
          object_id: petShelterID,
          content_type: petShelterID,
          comment_text: newComment.comment_text,
          comment_made_by_the_id_pet_seeker: user_id,
          comment_made_by_the_id_pet_shelter: null,
          rating: newComment.rating,
          is_application: false,
          name: user_name,
        };
      }

      console.log('Payload:', payload);

      // POST comment
      const response = await fetch(
        `http://127.0.0.1:8000/comments/shelters/${petShelterID}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const newCommentData = await response.json();
        console.log('New Comment Data:', newCommentData);

        setComments([...comments, newCommentData]);
        onClose();
        window.location.reload();
      } else {
        console.error('Error submitting comment:', response.status);
        const errorData = await response.json();
        console.error('Server error details:', errorData);
      }
    } catch (error) {
      console.error('Error submitting comment:', error.message);
    }
  };

  if (!petShelterDetail) {
    return (
      <Box p={4}>
        <Text>Retrieving pet shelter data. Please wait.</Text>
      </Box>
    );
  }

  let formattedPetShelterEmail =
    petShelterDetail.name.replace(/\s/g, '').toLowerCase() + '@gmail.com';

  return (
    <Box m={8} p={5}>
      <Box
        p={4}
        mb={5}
        bg='#FFFFFF'
        borderWidth='6px'
        borderRadius='md'
        borderColor='#BEE3F8'
      >
        <Heading textAlign='center' color='blue.500'>
          {petShelterDetail.name}
        </Heading>
        <Text textAlign='center' fontWeight='bold'>
          Shelter Information Page
        </Text>
      </Box>

      <Box
        p={3}
        boxShadow='md'
        borderWidth='5px'
        borderRadius='md'
        mb={4}
        bg='#FFFFFF'
        borderColor='#BEE3F8'
      >
        <Text
          textAlign='center'
          color='blue.500'
          fontWeight='bold'
          fontSize='xl'
        >
          Mission Statement:
        </Text>
        <Text textAlign='center'> {petShelterDetail.mission_statement}</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Box
          boxShadow='md'
          p={3}
          borderWidth='5px'
          borderRadius='md'
          bg='#FFFFFF'
          borderColor='#BEE3F8'
          mb={4}
        >
          <Text
            textAlign='center'
            color='blue.500'
            fontWeight='bold'
            fontSize='xl'
          >
            Address:
          </Text>
          <Text textAlign='center'> {petShelterDetail.address}</Text>
        </Box>

        <Box
          boxShadow='md'
          p={3}
          borderWidth='5px'
          borderRadius='md'
          bg='#FFFFFF'
          borderColor='#BEE3F8'
          mb={4}
        >
          <Text
            textAlign='center'
            color='blue.500'
            fontWeight='bold'
            fontSize='xl'
          >
            Contact Information:
          </Text>
          <Text textAlign='center'>
            {' '}
            Phone: {petShelterDetail.phone_number}
          </Text>
          <Text textAlign='center'> Email: {formattedPetShelterEmail}</Text>
        </Box>
      </SimpleGrid>

      <Box
        p={5}
        boxShadow='md'
        borderWidth='5px'
        borderRadius='md'
        mb={4}
        bg='#FFFFFF'
        borderColor='#BEE3F8'
      >
        <Heading textAlign='center' color='blue.500' mb={3}>
          Reviews
        </Heading>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems={{ base: 'stretch', md: 'center' }}
          mb={3}
        >
          <Badge
            ml={{ base: '0', md: '1' }}
            mb={{ base: '2', md: '0' }}
            fontSize='lg'
            colorScheme='green'
            borderRadius='md'
            p={2}
          >
            Average Rating: {calculateAverageRating(comments).toFixed(2)} Stars
            ({totalReviews} Reviews)
          </Badge>
          {!isPetShelter && (
            <Button
              onClick={onOpen}
              colorScheme='blue'
              mt={{ base: '2', md: '0' }}
            >
              Add a Review
            </Button>)}
        </Flex>

        {comments.length === 0 ? (
          <Text>No comments/reviews available for this shelter.</Text>
        ) : (
          <SimpleGrid columns={1} spacing={4}>
            {comments.map((comment, index) => (
              <Box
                key={comment.id}
                p={5}
                borderWidth='1px'
                borderRadius='md'
                bg='#F3F3F3'
                ref={index === comments.length - 1 ? lastCommentRef : null}
              >
                <Flex alignItems='center'>
                  {/* <Avatar
                    src={
                      commenterDetails[
                        comment.comment_made_by_the_id_pet_seeker
                      ]?.profile_pic
                    } // if there is time add profile pic to comments ... Shelter can have their own pfp/star or something to make it clear they are responding
                  /> */}
                  <Box>
                    {' '}
                    {/* ml={3} with avatar */}
                    <Text fontSize='lg' fontWeight='bold'>
                      {comment.name}
                    </Text>
                    <Rating rating={comment.rating} />
                  </Box>
                </Flex>
                <Text mt={3}>{comment.comment_text}</Text>
                <Text fontSize='sm' color='gray.500' mt={4}>
                  Created at:{' '}
                  {formatReadableDate(comment.comment_creation_time)}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder='Enter your review...'
              onChange={(e) =>
                setNewComment({ ...newComment, comment_text: e.target.value })
              }
              mb={2}
            />
            <RatingModal
              rating={newComment.rating}
              onRatingChange={handleRatingChange}
              maxStars={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCommentSubmit}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Grid templateColumns={columns} marginTop={"30px"} gap={6} justifyContent="center">
        {petListings.map(pet => (
          <PetListingCard key={pet.id} {...pet} /> // Spread operator to pass all pet properties as props
        ))}
      </Grid>
    </Box>
  );
}
export default ShelterDetailPage
