import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      px={4}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Link
          as={RouterLink}
          to="/"
          fontSize="xl"
          fontWeight="bold"
          color={useColorModeValue('gray.800', 'white')}
          _hover={{ textDecoration: 'none' }}
        >
          AlgoRank
        </Link>

        <Flex alignItems="center">
          <Stack direction="row" spacing={7}>
            <Link
              as={RouterLink}
              to="/problems"
              color={useColorModeValue('gray.600', 'gray.200')}
              _hover={{
                textDecoration: 'none',
                color: useColorModeValue('gray.800', 'white'),
              }}
            >
              Problems
            </Link>

            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />

            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  cursor="pointer"
                  minW={0}
                >
                  {user.username}
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Stack direction="row" spacing={4}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  colorScheme="brand"
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="brand"
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 