import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Input,
  Select,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { problemsAPI } from '../services/api';
import Loading from '../components/Loading';

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const { data: problems, isLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: problemsAPI.getProblems,
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredProblems = problems?.filter((problem: any) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      problem.difficulty.toLowerCase() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box p={4}>
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Problems
        </Text>
        <HStack spacing={4}>
          <Input
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxW="400px"
          />
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </HStack>
      </Box>

      <Box
        bg={bgColor}
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Difficulty</Th>
              <Th>Acceptance Rate</Th>
              <Th>Submissions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProblems?.map((problem: any) => (
              <Tr key={problem.id}>
                <Td>
                  <Link
                    as={RouterLink}
                    to={`/problems/${problem.id}`}
                    color="brand.500"
                    fontWeight="medium"
                    _hover={{ textDecoration: 'none', color: 'brand.600' }}
                  >
                    {problem.title}
                  </Link>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getDifficultyColor(problem.difficulty)}
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {problem.difficulty}
                  </Badge>
                </Td>
                <Td>{problem.acceptance_rate.toFixed(1)}%</Td>
                <Td>{problem.submissions_count.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Problems; 