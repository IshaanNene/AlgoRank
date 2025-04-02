import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface ProblemDetailsProps {
  title: string;
  difficulty: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  examples: Example[];
}

const ProblemDetails = ({
  title,
  difficulty,
  description,
  timeComplexity,
  spaceComplexity,
  examples,
}: ProblemDetailsProps) => {
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

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth={1}
      borderColor={borderColor}
      shadow="sm"
    >
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">{title}</Heading>
          <Badge
            colorScheme={getDifficultyColor(difficulty)}
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
          >
            {difficulty}
          </Badge>
        </HStack>

        <Text>{description}</Text>

        <Box>
          <Heading size="sm" mb={2}>
            Constraints:
          </Heading>
          <VStack align="stretch" spacing={1}>
            <Text>Time Complexity: {timeComplexity}</Text>
            <Text>Space Complexity: {spaceComplexity}</Text>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="sm" mb={4}>
            Examples:
          </Heading>
          <VStack align="stretch" spacing={4}>
            {examples.map((example, index) => (
              <Box
                key={index}
                p={4}
                borderWidth={1}
                borderRadius="md"
                borderColor={borderColor}
              >
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th width="50%">Input</Th>
                      <Th width="50%">Output</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>
                        <Text fontFamily="mono">{example.input}</Text>
                      </Td>
                      <Td>
                        <Text fontFamily="mono">{example.output}</Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
                {example.explanation && (
                  <Text mt={2} fontSize="sm" color="gray.600">
                    Explanation: {example.explanation}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProblemDetails; 