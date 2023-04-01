import React, { useState, useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import companiesData from '../topicModellingFinalOutput.json';
import { Box, Flex, Heading } from '@chakra-ui/react';

function WordCloud({ selectedCompany }) {
  const [prosWords, setProsWords] = useState([]);
  const [consWords, setConsWords] = useState([]);

  useEffect(() => {
    if (selectedCompany) {
      const companyData = companiesData.find(
        company => company.company === selectedCompany
      );
      setProsWords(companyData.pros.map(word => ({ text: word, value: 1 })));
      setConsWords(companyData.cons.map(word => ({ text: word, value: 1 })));
    }
  }, [selectedCompany]);

  const proOptions = {
    // shades of green
    colors: ['#99c68e', '#4DBD33', '#348017', '#96E97B', '#6AA84F'],
  };

  const consOptions = {
    // shades of red
    colors: ['#FF9999', '#FF4F4F', '#FF1A1A', '#C11B17', '#E34234'],
  };
  return (
    <Box>
      <Flex direction={'column'}>
        <Heading fontSize={'xl'} textAlign={'center'}>
          Pros
        </Heading>
        <ReactWordcloud options={proOptions} words={prosWords} />

        <Heading fontSize={'xl'} textAlign={'center'}>
          Cons
        </Heading>
        <ReactWordcloud options={consOptions} words={consWords} />
      </Flex>
    </Box>
  );
}

export default WordCloud;
