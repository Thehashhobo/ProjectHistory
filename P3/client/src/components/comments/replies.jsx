import React, { useState } from 'react';
import { Box, Collapse, Text, Button, Flex, Spacer } from '@chakra-ui/react';
import RatingModal from './stars';
import PropTypes from 'prop-types';

const Replies = ({ comment, onReplyClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
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
  return (
    <Box
      key={comment.id}
      p={5}
      borderWidth='1px'
      borderRadius='md'
      bg='#F3F3F3'
      borderColor='#666'
    >
      <Flex alignItems='center'>
        <Box>
          <Text fontSize='lg' fontWeight='bold'>
            {comment.name}
          </Text>
          {!comment.is_reply && <RatingModal rating={comment.rating} />}
        </Box>
        <Spacer />
        {comment.replies && comment.replies.length > 0 && (
          <Button onClick={toggleCollapse} colorScheme='blue'>
            {isOpen ? 'Hide Replies' : 'Show Replies'}
          </Button>
        )}
        <Button
          onClick={() => onReplyClick(comment.id)}
          colorScheme='blue'
          ml={2}
        >
          Reply
        </Button>
      </Flex>

      <Box ml={6}>
        {/* Render content specific to replies under the toggle */}
        <Text mt={3}>{comment.comment_text}</Text>
        <Text fontSize='sm' color='gray.500' mt={4}>
          Created at: {formatReadableDate(comment.comment_creation_time)}
        </Text>
      </Box>

      <Collapse in={isOpen} animateOpacity>
        <Box mt={4}>
          {comment.replies && comment.replies.length > 0 ? (
            comment.replies.map((reply) => (
              <Replies
                key={reply.id}
                comment={reply}
                onReplyClick={onReplyClick}
              />
            ))
          ) : (
            <Text>No replies available.</Text>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

Replies.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    comment_text: PropTypes.string.isRequired,
    comment_creation_time: PropTypes.string.isRequired,
    replies: PropTypes.arrayOf(PropTypes.object),
    is_reply: PropTypes.bool.isRequired,
    parent_comment: PropTypes.number,
  }).isRequired,
  onReplyClick: PropTypes.func.isRequired,
};

export default Replies;
