import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import { CheckCircleIcon } from '@chakra-ui/icons';

export default function About() {
  return (
    <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={'md'}
            alt={'product image'}
            src={
              'https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80'
            }
            fit={'cover'}
            align={'center'}
            w={'100%'}
            h={{ base: '100%', sm: '400px', lg: '500px' }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
            >
              About Us (ICT2107 Team P3_6)
            </Heading>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              />
            }
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text
                color={useColorModeValue('gray.600', 'gray.400')}
                fontSize={'xl'}
                fontWeight={'300'}
              >
                We are a team of undergraduates from SIT consisting of{' '}
                <b>Fabian Chua (2101506)</b>,{' '}
                <b>Norman Chia Min Jie (2100686)</b>,{' '}
                <b>Pang Ka Ho (2102047)</b>,{' '}
                <b>Shaun Sartra Varghese (2102172)</b>, and{' '}
                <b>Wang Qixian (2101751)</b>. As passionate student developers
                and big data scientists, we collaborated to design an analytical
                dashboard for our module{' '}
                <b>ICT2107 Distributed Computer Programming</b> that assists
                organizations in extracting insights from big data.
              </Text>
              <Text fontSize={'lg'}>
                Our project utilizes the <b>Hadoop MapReduce framework</b> for
                scalable sentiment analysis and topic modeling on large-scale
                company review data. We've integrated the{' '}
                <b>Stanford CoreNLP</b> library for more accurate sentiment
                analysis and employed the <b>Mallet</b> library for topic
                modeling.
              </Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Key Features
              </Text>

              <List spacing={2}>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  Scalable sentiment analysis using the HadoopMapReduce
                  framework
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  Integration with the Stanford CoreNLP library for improved
                  accuracy
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  Topic modeling using the Mallet library
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  Customizable visualization options for better understanding
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  Extraction of valuable insights from company reviews
                </ListItem>
              </List>
            </Box>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Purpose of the Project
              </Text>
              <Text fontSize={'lg'}>
                The purpose of this project is to help organizations gain
                valuable insights from employee reviews, which can inform
                business decisions and strategies. By analyzing large volumes of
                reviews through sentiment analysis and topic modeling, our
                system uncovers key themes and sentiments that contribute to
                employee satisfaction and dissatisfaction. This information
                enables companies to improve their policies and practices to
                better align with the needs and expectations of their workforce.
              </Text>
            </Box>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
