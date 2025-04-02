import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  useColorModeValue,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';
import { FaMemory } from 'react-icons/fa';

interface TestResult {
  success: boolean;
  execution_time_ms: number;
  output: string;
  error?: string;
}

interface ExecutionResultsProps {
  metrics: {
    total_time_ms: number;
    passed_count: number;
    failed_count: number;
    timeouts: number;
    errors: number;
    peak_memory_mb: number;
    peak_cpu_percent: number;
    test_results: TestResult[];
  };
}

const ExecutionResults = ({ metrics }: ExecutionResultsProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const totalTests = metrics.passed_count + metrics.failed_count;
  const successRate = (metrics.passed_count / totalTests) * 100;

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth={1}
      borderColor={borderColor}
      shadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <HStack spacing={4} justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Execution Results
          </Text>
          <Badge
            colorScheme={successRate === 100 ? 'green' : 'red'}
            fontSize="md"
            px={3}
            py={1}
            borderRadius="full"
          >
            {successRate.toFixed(0)}% Passed
          </Badge>
        </HStack>

        <Progress
          value={successRate}
          colorScheme={successRate === 100 ? 'green' : 'red'}
          size="sm"
          borderRadius="full"
        />

        <StatGroup>
          <Stat>
            <StatLabel>Total Time</StatLabel>
            <StatNumber>{metrics.total_time_ms.toFixed(2)}ms</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Memory Usage</StatLabel>
            <StatNumber>{metrics.peak_memory_mb.toFixed(2)}MB</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>CPU Usage</StatLabel>
            <StatNumber>{metrics.peak_cpu_percent.toFixed(1)}%</StatNumber>
          </Stat>
        </StatGroup>

        <Box>
          <HStack spacing={4} mb={4}>
            <HStack>
              <Icon as={CheckCircleIcon} color="green.500" />
              <Text>{metrics.passed_count} Passed</Text>
            </HStack>
            <HStack>
              <Icon as={WarningIcon} color="red.500" />
              <Text>{metrics.failed_count} Failed</Text>
            </HStack>
            <HStack>
              <Icon as={TimeIcon} color="orange.500" />
              <Text>{metrics.timeouts} Timeouts</Text>
            </HStack>
          </HStack>

          <Accordion allowMultiple>
            {metrics.test_results.map((result, index) => (
              <AccordionItem key={index}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon
                        as={result.success ? CheckCircleIcon : WarningIcon}
                        color={result.success ? 'green.500' : 'red.500'}
                      />
                      <Text>Test Case {index + 1}</Text>
                      <Badge
                        colorScheme={result.success ? 'green' : 'red'}
                        ml={2}
                      >
                        {result.execution_time_ms.toFixed(2)}ms
                      </Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={2}>
                    <Text fontWeight="bold">Output:</Text>
                    <Box
                      p={2}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      fontFamily="mono"
                    >
                      {result.output || 'No output'}
                    </Box>
                    {result.error && (
                      <>
                        <Text fontWeight="bold" color="red.500">
                          Error:
                        </Text>
                        <Box
                          p={2}
                          bg={useColorModeValue('red.50', 'red.900')}
                          borderRadius="md"
                          fontFamily="mono"
                          color="red.500"
                        >
                          {result.error}
                        </Box>
                      </>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </VStack>
    </Box>
  );
};

export default ExecutionResults; 