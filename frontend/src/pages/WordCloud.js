import React, { useState, useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import companiesData from '../topicModellingFinalOutput.json';
import { Box, Heading } from '@chakra-ui/react';

function WordCloud({ selectedCompany }) {
  const [prosWords, setProsWords] = useState([]);
  const [consWords, setConsWords] = useState([]);

  useEffect(() => {
    if (selectedCompany) {
      const companyData = companiesData[selectedCompany];

      // Add this check
      if (companyData) {
        setProsWords(
          Object.entries(companyData['Pros Topic']).map(([text, value]) => ({
            text,
            value,
          }))
        );
        setConsWords(
          Object.entries(companyData['Cons Topic']).map(([text, value]) => ({
            text,
            value,
          }))
        );
      }
    }
  }, [selectedCompany]);

  const wordcloudSize = [200, 320]; // Set the size for both word clouds

  const proOptions = {
    colors: ['#99c68e', '#4DBD33', '#348017', '#96E97B', '#6AA84F'],
    rotationAngles: [0, 45],
    rotations: 0,
  };

  const consOptions = {
    colors: ['#FF9999', '#FF4F4F', '#FF1A1A', '#C11B17', '#E34234'],
    rotationAngles: [0, 45],
    rotations: 0,
  };

  return (
    <Box>
      <Heading fontSize={'xl'} textAlign={'center'}>
        Pros
      </Heading>
      <ReactWordcloud
        options={proOptions}
        size={wordcloudSize}
        words={prosWords}
      />
      <Heading fontSize={'xl'} textAlign={'center'}>
        Cons
      </Heading>
      <ReactWordcloud
        options={consOptions}
        size={wordcloudSize}
        words={consWords}
      />
    </Box>
  );
}

export default WordCloud;
