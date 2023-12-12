import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Image,
  Badge,
  Flex,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { AiFillHeart } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const formatDate = (timestamp) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Date(timestamp).toLocaleDateString(undefined, options);
};

const BlogPost = () => {
  const { colorMode } = useColorMode();
  const { authorID, blogId } = useParams();
  const [blogPost, setBlogPost] = useState({});
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      // Update the local state immediately
      setIsLiked((prevIsLiked) => !prevIsLiked);
      setBlogPost((prevBlogPost) => ({
        ...prevBlogPost,
        likes: prevBlogPost.likes + (isLiked ? -1 : 1),
      }));
      const payload = { likes: 1 };
      const accessToken = localStorage.getItem('access_token');

      // Send the request to the server
      const response = await fetch(`http://127.0.0.1:8000/blogs/${blogId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Revert the local state if the request fails
        setIsLiked((prevIsLiked) => !prevIsLiked);
        setBlogPost((prevBlogPost) => ({
          ...prevBlogPost,
          likes: prevBlogPost.likes + (isLiked ? -1 : 1),
        }));
        console.error('Error in liking blog post:', response.statusText);
      } else {
        // Update localStorage to persist like status
        localStorage.setItem(`liked_${blogId}`, isLiked ? 'false' : 'true');
      }
    } catch (error) {
      console.error('Error in liking blog post:', error.message);
    }
  };
  useEffect(() => {
    const getPostDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/blogs/posts/${blogId}/`
        );
        if (response.status === 200) {
          setBlogPost(response.data);
          // Check localStorage to determine the like status
          const storedLikeStatus = localStorage.getItem(`liked_${blogId}`);
          setIsLiked(storedLikeStatus === 'true');
        }
      } catch (error) {
        console.error('ERROR IN RETRIEVING BLOGS: ', error.message);
      }
    };

    getPostDetails();
  }, [blogId]);

  return (
    <Box
      borderRadius='xl'
      overflow='hidden'
      boxShadow='md'
      p={6}
      mb={8}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      border='1px solid'
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
    >
      <Text fontSize='3xl' fontWeight='bold' mb={2} color='blue.500'>
        {blogPost.title}
      </Text>
      <Text fontSize='md' color='gray.500' mb={4}>
        Posted on {formatDate(blogPost.date_posted)}
      </Text>
      {blogPost.image && (
        <Image
          src={blogPost.image}
          alt={blogPost.title}
          mb={4}
          maxH='300px'
          objectFit='cover'
          borderRadius='md'
        />
      )}
      <Text fontSize='lg' color={colorMode === 'light' ? 'black' : 'white'}>
        {blogPost.content}
      </Text>
      <Flex justifyContent='space-between' alignItems='center' mt={6}>
        <Text fontSize='sm' color='gray.500'>
          Posted by {blogPost.shelter_name}
        </Text>
        <Flex alignItems='center'>
          <Badge
            colorScheme='blue'
            fontSize='xl'
            mr={2}
            borderRadius='md'
            px={2}
            py={1}
          >
            Likes: {blogPost.likes}
          </Badge>
          <IconButton
            aria-label='Like'
            icon={<AiFillHeart />}
            size='md'
            colorScheme={isLiked ? 'red' : 'gray'}
            variant='outline'
            onClick={handleLike}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default BlogPost;
