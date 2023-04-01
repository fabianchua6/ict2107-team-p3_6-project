import { Card, CardBody, CardHeader } from '@chakra-ui/card';
import { Flex, Grid } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Stat, StatLabel, StatNumber } from '@chakra-ui/stat';
import {
  Heading,
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
import WordCloud from '../pages/WordCloud';
import PieChart from '../components/PieChart';
import { ScatterChart } from '../components/ScatterChart';

const CardStat = ({ title, numbers, color }) => {
  return (
    <Card bg={color} w="full" h="full">
      <CardBody>
        <Stat>
          <StatLabel>{title}</StatLabel>
          <StatNumber>{numbers}</StatNumber>
        </Stat>
      </CardBody>
    </Card>
  );
};

const SentimentStat = ({ display, title, numbers }) => {
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

  useEffect(() => {
    const breakdown = jsonData[selectedCompany]?.['Breakdown of Sentiments'];

    setSentimentData(Object.values(breakdown));
  }, [selectedCompany]);

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
          color="red.200"
        />
        <CardStat
          title="Very Negative"
          numbers={sentimentData ? sentimentData[4] : '-'}
          color="red.400"
        />
        <SentimentStat
          // hide in mobile view
          display={{ base: 'none', md: 'block' }}
          title={'Average Sentiment Score'}
          numbers={
            jsonData[selectedCompany]?.['Average sentiment per review'] || '-'
          }
        />
        <CardStat
          title="Neutral"
          numbers={sentimentData ? sentimentData[2] : '-'}
          color="gray.300"
        />
        <CardStat
          title="Positive"
          numbers={sentimentData ? sentimentData[1] : '-'}
          color="green.200"
        />
        <CardStat
          title="Very Positive"
          numbers={sentimentData ? sentimentData[0] : '-'}
          color="green.400"
        />
        <SentimentStat
          // show in mobile view
          display={{ base: 'block', md: 'none' }}
          title={'Average Sentiment Score'}
          numbers={
            jsonData[selectedCompany]?.['Average sentiment per review'] || '-'
          }
        />
        <SentimentStat
          title={'Number of Reviews Analysed'}
          numbers={
            jsonData[selectedCompany]?.['Number of Reviews Analysed'] || '-'
          }
        />
      </Grid>
      <Flex direction={['column', 'row']} mt={4} gap={4}>
        <Card w={['full', '67%']} h="full">
          <CardHeader>
            <Heading textAlign={'center'} size={'lg'}>
              Sentimental Analysis of {selectedCompany}
            </Heading>
          </CardHeader>
          <CardBody>
            <Tabs>
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
                  <PolarPie
                    data={sentimentData}
                    title={`${selectedCompany} Sentiment Analysis`}
                  />
                </TabPanel>
                <TabPanel>
                  <RadarChart
                    selectedCompany={selectedCompany}
                    data={sentimentData}
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
