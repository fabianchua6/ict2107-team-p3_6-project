# import the libraries
import os
import time

import numpy as np
import pandas as pd
import math
import re

from bs4 import BeautifulSoup
from urllib.request import Request, urlopen


def review_scraper(url):
    # scraping the web page content
    hdr = {"User-Agent": "Mozilla/5.0"}
    req = Request(url, headers=hdr)
    page = urlopen(req)
    soup = BeautifulSoup(page, "html.parser")

    # define some lists
    Summary = []
    Date_n_JobTitle = []
    Date = []
    JobTitle = []
    AuthorLocation = []
    OverallRating = []
    Pros = []
    Cons = []

    # check the total number of reviews
    countReviews = soup.find("div", {"data-test": "pagination-footer-text"}).text
    countReviews = float(
        countReviews.split(" Reviews")[0].split("of ")[1].replace(",", "")
    )

    # calculate the max number of pages (assuming 10 reviews a page)
    countPages = math.ceil(countReviews / 10)
    pageCap = 500
    if countPages > pageCap:
        countPages = pageCap
    # Control number of pages
    # countPages = 3

    input_url = url.replace(".htm", "")

    for x in range(1, countPages + 1):
        page_url = input_url + "_P{}.htm".format(x)
        hdr = {"User-Agent": "Mozilla/5.0"}
        req = Request(page_url, headers=hdr)
        page = urlopen(req)
        soup = BeautifulSoup(page, "html.parser")

        # get the Summary
        for x in soup.find_all("h2", {"class": "mb-xxsm mt-0 css-93svrw el6ke055"}):
            Summary.append(x.text)
        # get the Posted Date and Job Title
        for x in soup.find_all(
            "span", {"class": "middle common__EiReviewDetailsStyle__newGrey"}
        ):
            Date_n_JobTitle.append(x.text)
        # get the Posted Date
        for x in Date_n_JobTitle:
            Date.append(x.split(" -")[0])
        # get Job Title
        for x in Date_n_JobTitle:
            JobTitle.append(x.split(" -")[1])
        # get Author Location
        for x in soup.find_all("span", {"class": "middle"}):
            nested_span = x.span
            if nested_span is not None:
                AuthorLocation.append(nested_span.text)
            else:
                continue
        # get Overall Rating
        for x in soup.find_all("span", {"class": "ratingNumber mr-xsm"}):
            floatRating = float(x.text)
            roundedRating = round(floatRating)
            OverallRating.append(roundedRating)
        # get Pros
        for x in soup.find_all("span", {"data-test": "pros"}):
            rawPros = x.text
            cleanedPros = text_cleaner(rawPros)
            Pros.append(cleanedPros)
        # get Cons
        for x in soup.find_all("span", {"data-test": "cons"}):
            rawCons = x.text
            cleanedCons = text_cleaner(rawCons)
            Cons.append(cleanedCons)

    # putting everything together
    Reviews = pd.DataFrame(
        list(zip(Summary, Date, JobTitle, AuthorLocation, OverallRating, Pros, Cons)),
        columns=[
            "Summary",
            "Date",
            "JobTitle",
            "AuthorLocation",
            "OverallRating",
            "Pros",
            "Cons",
        ],
    )

    return Reviews


def get_company_name(url):
    # scraping the web page content
    hdr = {"User-Agent": "Mozilla/5.0"}
    req = Request(url, headers=hdr)
    page = urlopen(req)
    soup = BeautifulSoup(page, "html.parser")

    # get company name
    raw_company = soup.select_one(
        "h1.eiReviews__EIReviewsPageStyles__newPageHeader.col-sm-auto"
    ).text

    # split words and format company name without 'Reviews"
    words = raw_company.split()
    if words[-1] == "Reviews":
        # Remove the last word
        words = words[:-1]
    # Join the words back into a string
    formatted_company = "_".join(words)

    return formatted_company


def text_cleaner(text):
    # Remove non-alphanumeric characters and return only the words
    words = re.findall(r"\b\w+\b", text)
    # Join the words into a string separated by spaces
    clean_text = " ".join(words)

    return clean_text


# Driver Code
# company glassdoor page URL
input_url = "https://www.glassdoor.sg/Reviews/United-Overseas-Bank-Reviews-E11462.htm"

# Scrape
output = pd.DataFrame(review_scraper(input_url))

# Get company name to use as csv file name
csv_name = get_company_name(
    input_url + str(1) + ".htm?sort.sortType=RD&sort.ascending=false"
)

output.to_csv(f"{csv_name}.csv", index=False)
