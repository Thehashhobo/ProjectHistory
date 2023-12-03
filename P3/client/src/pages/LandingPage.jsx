import { ChakraProvider, Box, Button, Container, Heading, Text, Input, Textarea } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function App() {
  return (
    <ChakraProvider>
      {/* Navigation Bar */}
      <Box as="nav" bg="black" color="white" py="4">
        <Container>
          <Link to="/" as="a" fontSize="xl" fontWeight="bold" textDecoration="none">
            Barnyard Buddies
          </Link>
          <Box ml="auto" display="flex" alignItems="center">
            <Link to="/about" as="a" mr="4" textDecoration="none">
              About Us
            </Link>
            <Button as={Link} to="/login" colorScheme="white" variant="link">
              Log In
            </Button>
            <Button as={Link} to="/signup" colorScheme="white" variant="link">
              Sign Up
            </Button>
            <Button as={Link} to="/search" colorScheme="white" variant="link">
              Search
            </Button>
            <Button as={Link} to="/account" colorScheme="white" variant="link">
              Account
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Section */}
      <Box as="header" bg="primary" color="white" textAlign="center" py="5">
        <Container>
          <img src="images/barnyard%20buddies%20logo.png" alt="Barnyard Buddies Logo" mb="4" maxW="100%" />
          <Heading as="h1" fontSize="4xl">
            Welcome to Barnyard Buddies
          </Heading>
          <Text fontSize="xl" mt="2">
            Your source for farm animals and supplies
          </Text>
          <Button as={Link} to="/contact" colorScheme="light" size="lg" mt="4">
            Contact Us
          </Button>
        </Container>
      </Box>

      {/* About Section */}
      <Box as="section" id="about" py="5">
        <Container>
          <Box display="flex" flexDirection={{ base: "column", lg: "row" }}>
            <Box flex="1" mb={{ base: "4", lg: "0" }}>
              <Heading as="h2" fontSize="2xl" mb="4">
                About Us
              </Heading>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at turpis vitae ex dapibus euismod eu ac ligula.
              </Text>
            </Box>
            <Box flex="1">
              <img src="barnyard-image.jpg" alt="Barnyard" className="img-fluid rounded-circle" />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box as="section" id="services" bg="gray.100" py="5">
        <Container>
          <Heading as="h2" textAlign="center" mb="5">
            Our Services
          </Heading>
          {/* Add Chakra UI cards for services here */}
        </Container>
      </Box>

      {/* Contact Section */}
      <Box as="section" id="contact" py="5">
        <Container>
          <Heading as="h2" textAlign="center" mb="5">
            Contact Us
          </Heading>
          <Box display={{ base: "block", lg: "flex" }}>
            <Box flex="1" mr={{ lg: "8" }} mb={{ base: "4", lg: "0" }}>
              <form>
                <Box mb="3">
                  <label htmlFor="name" fontSize="lg">
                    Name
                  </label>
                  <Input type="text" id="name" placeholder="Your Name" size="lg" />
                </Box>
                <Box mb="3">
                  <label htmlFor="email" fontSize="lg">
                    Email
                  </label>
                  <Input type="email" id="email" placeholder="Your Email" size="lg" />
                </Box>
                <Box mb="3">
                  <label htmlFor="message" fontSize="lg">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Your Message" size="lg" />
                </Box>
                <Button type="submit" colorScheme="primary" size="lg">
                  Submit
                </Button>
              </form>
            </Box>
            <Box flex="1">
              {/* Add contact info here */}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="black" color="white" textAlign="center" py="3">
        <Container>&copy; 2023 Barnyard Buddies</Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
