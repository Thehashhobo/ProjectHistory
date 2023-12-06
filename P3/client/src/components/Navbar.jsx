import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logoImage from './logo.png';
import { Link } from 'react-router-dom';

const Links = [
  { label: 'Search Projects', to: '/search' },
  { label: 'Saved Projects', to: '/saved' },
  { label: 'Create Posting', to: '/createproject' },
  { label: 'Register', to: '/register' },
];

const NavLink = (props) => {
  const { children } = props;

  return (
    <Box
      as='a'
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'rgb(255, 255, 255, 0.36)',
      }}
      href={'#'}
    >
      {children}
    </Box>
  );
};

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const imageStyle = {
    width: '25%', // Set the width to 100%
    height: '50%', // Set the height to 100%
  };
  return (
    // {useColorModeValue('gray.100', 'gray.900')}
    <>
      <Box bg='#000019' px={4} py={2}>
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
          color={'white'}
        >
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box mr={6.5} px={0} alignItems={'center'}>
              <Image
                src={logoImage}
                alt='Logo'
                boxSize='130px'
                objectFit='cover'

              // style={imageStyle}
              />
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map(({ label, to }) => (
                <NavLink key={label}>
                  <Link to={to}>{label}</Link>
                </NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(({ label, to }) => (
                <NavLink key={label}>
                  <Link to={to}>{label}</Link>
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}