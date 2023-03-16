#import the libraries
import os
import time

import numpy as np
import pandas as pd
import math

from bs4 import BeautifulSoup
from urllib.request import Request, urlopen

def review_scraper(url):
  #scraping the web page content
  hdr = {'User-Agent': 'Mozilla/5.0'}
  req = Request(url,headers=hdr)
  page = urlopen(req)
  soup = BeautifulSoup(page, "html.parser") 

  #define some lists
  Company = []
  Summary=[]
  Date_n_JobTitle=[]
  Date=[]
  JobTitle=[]
  AuthorLocation=[]
  OverallRating=[]
  Pros=[]
  Cons=[]

  #get company name
  raw_company = soup.select_one('h1.eiReviews__EIReviewsPageStyles__newPageHeader.col-sm-auto').text

  #split words and format company name without 'Reviews"
  words = raw_company.split()
  if words[-1] == "Reviews":
    # Remove the last word
    words = words[:-1]
  # Join the words back into a string
  formatted_company = " ".join(words)

  #get the Summary
  for x in soup.find_all('h2', {'class':'mb-xxsm mt-0 css-93svrw el6ke055'}):
    Summary.append(x.text)
    Company.append(formatted_company)

  #get the Posted Date and Job Title
  for x in soup.find_all('span', {'class':'middle common__EiReviewDetailsStyle__newGrey'}):
    Date_n_JobTitle.append(x.text)

  #get the Posted Date
  for x in Date_n_JobTitle:
    Date.append(x.split(' -')[0])

  #get Job Title
  for x in Date_n_JobTitle:
    JobTitle.append(x.split(' -')[1])

  #get Author Location
  for x in soup.find_all('span', {'class':'middle'}):
    nested_span = x.span
    if nested_span is not None:
      AuthorLocation.append(nested_span.text)
    else:
      continue

  #get Overall Rating
  for x in soup.find_all('span', {'class':'ratingNumber mr-xsm'}):
    OverallRating.append(float(x.text))

  #get Pros
  for x in soup.find_all('span', {'data-test':'pros'}):
    Pros.append(x.text)

  #get Cons
  for x in soup.find_all('span', {'data-test':'cons'}):
    Cons.append(x.text)

  #putting everything together
  Reviews = pd.DataFrame(list(zip(Company, Summary, Date, JobTitle, AuthorLocation, OverallRating, Pros, Cons)), 
                    columns = ['Company', 'Summary', 'Date', 'JobTitle', 'AuthorLocation', 'OverallRating', 'Pros', 'Cons'])

  # Create a DataFrame to store the scraped data
  # Reviews = pd.DataFrame(
  #     {'Company': Company,
  #       'Summary': Summary,
  #       'Date': Date,
  #       'JobTitle': JobTitle,
  #       'AuthorLocation': AuthorLocation,
  #       'OverallRating': OverallRating,
  #       'Pros': Pros,
  #       'Cons': Cons
  #     })
  
  return Reviews

def get_company_name(url):
  #scraping the web page content
  hdr = {'User-Agent': 'Mozilla/5.0'}
  req = Request(url,headers=hdr)
  page = urlopen(req)
  soup = BeautifulSoup(page, "html.parser")

  #get company name
  raw_company = soup.select_one('h1.eiReviews__EIReviewsPageStyles__newPageHeader.col-sm-auto').text

  #split words and format company name without 'Reviews"
  words = raw_company.split()
  if words[-1] == "Reviews":
    # Remove the last word
    words = words[:-1]
  # Join the words back into a string
  formatted_company = " ".join(words)

  return formatted_company

#paste/replace the url to the first page of the company's Glassdoor review in between the ""
input_url="https://www.glassdoor.sg/Reviews/Infocomm-Media-Development-Authority-Reviews-E1536948.htm"

#scraping the first page content
hdr = {'User-Agent': 'Mozilla/5.0'}
req = Request(input_url+str(1)+".htm?sort.sortType=RD&sort.ascending=false",headers=hdr)
page = urlopen(req)
soup = BeautifulSoup(page, "html.parser") 

#check the total number of reviews
countReviews = soup.find('div', {'data-test':'pagination-footer-text'}).text
countReviews = float(countReviews.split(' Reviews')[0].split('of ')[1].replace(',',''))

#calculate the max number of pages (assuming 10 reviews a page)
countPages = math.ceil(countReviews/10)
countPages

#I'm setting the max pages to scrape to 3 here to save time
# maxPage = 1 + 1
#uncomment the line below to set the max page to scrape (based on total number of reviews)
maxPage = countPages + 1

#scraping multiple pages of company glassdoor review
output = review_scraper(input_url+str(1)+".htm?sort.sortType=RD&sort.ascending=false")
for x in range(2,maxPage):
  url = input_url+"_P"+str(x)+".htm?sort.sortType=RD&sort.ascending=false"
  output = output.append(review_scraper(url), ignore_index=True)

# Get company name to use as csv file name
csv_name = get_company_name(input_url+str(1)+".htm?sort.sortType=RD&sort.ascending=false")

output.to_csv(f"{csv_name}.csv", index = False)

#display the output
display(output)