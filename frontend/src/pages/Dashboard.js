import { Card, CardBody, CardHeader } from '@chakra-ui/card';
import { Flex, Grid } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Stat, StatLabel, StatNumber } from '@chakra-ui/stat';
import {
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import RadarChart from '../components/RadarChart';
import PolarPie from '../components/PolarPie';
import jsonData from '../wordMapFinalOutput.json';
import NLPJsonData from '../sampleNlpSaOutput.json';
import WordCloud from '../pages/WordCloud';
import PieChart from '../components/PieChart';
import { ScatterChart } from '../components/ScatterChart';

const CardStat = ({ title, numbers, total, color }) => {
  const percentage = total ? ((numbers / total) * 100).toFixed(2) + '%' : '-';
  return (
    <Card bg={color} w="full" h="full">
      <CardBody>
        <Stat>
          <StatLabel>{title}</StatLabel>
          <StatNumber>
            {numbers} ({percentage})
          </StatNumber>
        </Stat>
      </CardBody>
    </Card>
  );
};

const SentimentStat = ({ display, title, numbers, total }) => {
  return (
    <Card display={display}>
      <CardBody>
        <Stat>
          <StatLabel>{title}</StatLabel>
          <StatNumber>{numbers}</StatNumber>
        </Stat>
      </CardBody>
    </Card>
  );
};

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState('DBS');
  const [sentimentData, setSentimentData] = useState(null);
  const [useNLPData, setUseNLPData] = useState(false);
  const handleUseNLPDataChange = event => {
    setUseNLPData(event.target.checked);
  };
  const totalReviews = sentimentData
    ? sentimentData.reduce((a, b) => a + b, 0)
    : null;

  useEffect(() => {
    const breakdown =
      (useNLPData ? NLPJsonData : jsonData)[selectedCompany]?.[
        'Breakdown of Sentiments'
      ] ?? {};

    setSentimentData(Object.values(breakdown));
  }, [selectedCompany, useNLPData]);

  const handleCompanyChange = event => {
    setSelectedCompany(event.target.value);
  };

  const companies = Object.keys(jsonData);

  return (
    <Flex direction={'column'} justifyContent="center">
      <Grid
        templateColumns={['repeat(1, 1fr)', 'repeat(4, 2fr)']}
        gap={2}
        w="full"
      >
        <Card
          variant={'outline'}
          borderWidth="1px"
          borderColor={'gray.800'}
          w="full"
          h="full"
        >
          <CardBody>
            <Stat>
              <StatLabel>Company Name</StatLabel>
              <StatNumber>
                <Select
                  onChange={handleCompanyChange}
                  variant="flushed"
                  value={selectedCompany}
                >
                  {companies.map(company => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </Select>
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>{' '}
        <CardStat
          title="Negative"
          numbers={sentimentData ? sentimentData[3] : '-'}
          total={totalReviews}
          color="red.200"
        />
        <CardStat
          title="Very Negative"
          numbers={sentimentData ? sentimentData[4] : '-'}
          total={totalReviews}
          color="red.400"
        />
        <SentimentStat
          // hide in mobile view
          display={{ base: 'none', md: 'block' }}
          title={'Average Sentiment Score'}
          //
          numbers={
            useNLPData
              ? '-'
              : jsonData[selectedCompany]?.['Average sentiment per review']
          }
        />
        <CardStat
          title="Neutral"
          numbers={sentimentData ? sentimentData[2] : '-'}
          total={totalReviews}
          color="gray.300"
        />
        <CardStat
          title="Positive"
          numbers={sentimentData ? sentimentData[1] : '-'}
          total={totalReviews}
          color="green.200"
        />
        <CardStat
          title="Very Positive"
          numbers={sentimentData ? sentimentData[0] : '-'}
          total={totalReviews}
          color="green.400"
        />
        <SentimentStat
          // show in mobile view
          display={{ base: 'block', md: 'none' }}
          title={'Average Sentiment Score'}
          numbers={
            useNLPData
              ? '-'
              : jsonData[selectedCompany]?.['Average sentiment per review']
          }
        />
        <SentimentStat
          title={'Number of Reviews Analysed'}
          numbers={
            useNLPData
              ? '-'
              : jsonData[selectedCompany]?.['Number of Reviews Analysed']
          }
        />
      </Grid>
      <Flex direction={['column', 'row']} mt={4} gap={4}>
        <Card w={['full', '67%']} h="full">
          <CardHeader>
            <Flex>
              <Heading w="full" textAlign={'center'} size={'lg'}>
                Sentimental Analysis of {selectedCompany}
              </Heading>
              <FormControl
                w="auto"
                minWidth={'150px'}
                display="flex"
                direction="row"
                alignItems="center"
              >
                <FormLabel mb="0">Use NLP Data</FormLabel>
                <Switch onChange={handleUseNLPDataChange} />
              </FormControl>
            </Flex>
          </CardHeader>
          <CardBody>
            <Tabs isFitted>
              <TabList>
                <Tab>Pie Chart</Tab>
                <Tab>Polar Pie</Tab>
                <Tab>Radar Chart</Tab>
                <Tab>Scatter Chart</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <PieChart data={sentimentData} />
                </TabPanel>
                <TabPanel>
                  <PolarPie data={sentimentData} />
                </TabPanel>
                <TabPanel>
                  <RadarChart
                    data={sentimentData}
                    selectedCompany={selectedCompany}
                  />
                </TabPanel>
                <TabPanel>
                  <ScatterChart selectedCompany={selectedCompany} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
        <Card w={['full', '33%']}>
          <CardHeader>
            <Heading textAlign={'center'} size={'lg'}>
              Topic Modelling Analysis of {selectedCompany}
            </Heading>
          </CardHeader>
          <CardBody>
            <WordCloud selectedCompany={selectedCompany} />
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}
