import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaCode, FaChartLine, FaTrophy, FaUsers } from 'react-icons/fa';

const Feature = ({ title, text, icon }: any) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="lg"
      p={6}
      spacing={3}
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      transition="all 0.3s"
    >
      <Icon as={icon} w={10} h={10} color="brand.500" />
      <Text fontWeight="bold" fontSize="xl">
        {title}
      </Text>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Stack>
  );
};

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('brand.50', 'gray.900')}
        py={20}
        borderRadius="lg"
        mb={16}
      >
        <Container maxW="container.xl">
          <Stack spacing={8} alignItems="center" textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              backgroundClip="text"
            >
              Master Algorithms & Data Structures
            </Heading>
            <Text
              fontSize="xl"
              color={useColorModeValue('gray.600', 'gray.400')}
              maxW="2xl"
            >
              Practice coding problems, track your progress, and improve your
              problem-solving skills with AlgoRank's comprehensive platform.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button
                as={RouterLink}
                to="/problems"
                size="lg"
                colorScheme="brand"
                px={8}
              >
                Start Practicing
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                variant="outline"
                colorScheme="brand"
                px={8}
              >
                Sign Up Free
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          <Feature
            icon={FaCode}
            title="Multiple Languages"
            text="Write and test your solutions in C, C++, Java, Go, or Rust with our advanced code editor."
          />
          <Feature
            icon={FaChartLine}
            title="Performance Metrics"
            text="Get detailed insights into your code's performance, including execution time and memory usage."
          />
          <Feature
            icon={FaTrophy}
            title="Competitive Learning"
            text="Compare your solutions with others and climb the leaderboard rankings."
          />
          <Feature
            icon={FaUsers}
            title="Active Community"
            text="Join a community of developers, share solutions, and learn from each other."
          />
        </SimpleGrid>
      </Container>

      {/* Statistics Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.800')} py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Box textAlign="center">
              <Text fontSize="6xl" fontWeight="bold" color="brand.500">
                100+
              </Text>
              <Text fontSize="xl">Coding Problems</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="6xl" fontWeight="bold" color="brand.500">
                5
              </Text>
              <Text fontSize="xl">Programming Languages</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="6xl" fontWeight="bold" color="brand.500">
                1000+
              </Text>
              <Text fontSize="xl">Active Users</Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="container.xl" py={16}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          align="center"
          justify="space-between"
          bg={useColorModeValue('brand.50', 'gray.800')}
          p={8}
          borderRadius="lg"
        >
          <Stack spacing={4} maxW="lg">
            <Heading size="lg">Ready to Start Your Journey?</Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Join thousands of developers who are improving their coding skills
              with AlgoRank.
            </Text>
          </Stack>
          <Button
            as={RouterLink}
            to="/register"
            size="lg"
            colorScheme="brand"
            px={8}
          >
            Get Started Now
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home; 