import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTopWidth={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container
        as={Stack}
        maxW="container.xl"
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2024 AlgoRank. All rights reserved</Text>
        <Stack direction="row" spacing={6}>
          <Link
            href="https://github.com/IshaanNene/AlgoRank"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon as={FaGithub} w={6} h={6} />
          </Link>
          <Link
            href="https://linkedin.com/in/ishaan-nene"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon as={FaLinkedin} w={6} h={6} />
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer; 