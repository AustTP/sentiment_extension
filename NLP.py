import urllib
import nltk
import rake_nltk
import requests
import json
from bs4 import BeautifulSoup

# rake_nltk is the library needed for keyword extraction
from rake_nltk import Metric, Rake

import operator
from nltk.corpus import stopwords
set(stopwords.words('english'))
from nltk.tokenize import word_tokenize, sent_tokenize

# Synonyms e.g., mother, mom, and mommy should be treated the same way
# For this, use a Stemmer - an algorithm to bring words to its root word.
from nltk.stem import PorterStemmer

class NLP:
	def __init__(self, html):
		# print(html['text'])
		res = len(html['text'].split()) + int(html['wordCount'])

		self.summary = json.dumps({'wordCount': res, 'words': html['text'], 'score': res})

		# punctuation_chars = ["'", '"', ",", ".", "!", ":", ";", '#', '@']
		# # lists of words to use
		# positive_words = []
		# with open("positive_words.txt") as pos_f:
		# for lin in pos_f:
		# if lin[0] != ';' and lin[0] != '\n':
		# positive_words.append(lin.strip())


		# negative_words = []
		# with open("negative_words.txt") as pos_f:
		# for lin in pos_f:
		# if lin[0] != ';' and lin[0] != '\n':
		# negative_words.append(lin.strip())

	# def strip_punctuation(x):
		# for char in punctuation_chars:
		# x = x.replace(char, "")
		# return x

	# def get_pos(strsentence):
		# strsentence = strip_punctuation(strsentence)
		# strsentence = strsentence.lower()
		# spliting = strsentence.split()
		# count = 0
		# for word in spliting:
		# if word in positive_words:
		# count += 1
		# return count

	# def get_neg(strsentence):
		# strsentence = strip_punctuation(strsentence)
		# strsentence = strsentence.lower()
		# spliting = strsentence.split()
		# count = 0
		# for word in spliting:
		# if word in negative_words:
		# count += 1
		# return count

		# read_file = file_open.readlines()
		# print(read_file)

	# def writedataonfile(resultingdatafile):
		# resultingdatafile.write("Number of Retweets, Number of Replies, Positive Score, Negative Score, Net Score")
		# resultingdatafile.write("\n")

	# for eachline in read_file[1:]:
	# eachline = eachline.strip().split(',')
	# resultingdatafile.write("{}, {}, {}, {}, {}".format(eachline[1], eachline[2], get_pos(eachline[0]), get_neg(eachline[0]), (get_pos(eachline[0])-get_neg(eachline[0]))))    
	# resultingdatafile.write("\n")

	# writedataonfile(resultingdatafile)
	# file_open.close()
	# resultingdatafile.close()