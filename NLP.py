import re
import json

import operator
from nltk.corpus import stopwords
set(stopwords.words('english'))
# from nltk.tokenize import word_tokenize, sent_tokenize

from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Synonyms should be treated the same way. Stemmer is an algorithm to bring words to its root word.
from nltk.stem import PorterStemmer

sid = SentimentIntensityAnalyzer()

class NLP:
	def __init__(self, html):
		self.text = html['text']
		
		self.summary = ''
		
		# Create dictionary that will hold frequency of words in text - not including stop words
		self.freqTable = dict()

		# Stemmer (puts pluralized, tensed words/verbs into their root form eg: agreed -> agree, flies -> fli)
		self.ps = PorterStemmer()

		self.stopWords = set(stopwords.words('english'))

		self.createSummary()

	def applyBackspace(self):
		while True:
			# If you find a character followed by a backspace, remove both
			temp = re.sub('.\b', '', self.text, count = 1)
			
			if len(self.text) == len(temp):
				# now remove any backspaces from beginning of string
				return re.sub('\b+', '', temp)

			self.text = temp
			
	# def tally(self, words):
		# for word in words:
			# word = word.lower()
			
			# if word in self.stopWords:
				# continue
				
			# Pass every word by the stemmer before adding it to our freqTable
			# It is important to stem every word when going through each sentence before adding the score of the words in it.
			# word = self.ps.stem(word)
			
			# if word in self.freqTable:
				# self.freqTable[word] += 1
			# else:
				# self.freqTable[word] = 1

	def createSummary(self):
		try:
			self.applyBackspace()
			
			# Tokenize
			# words = word_tokenize(self.text)

			# Tally occurrences into freqTable
			# self.tally(words)
            
			self.summary = json.dumps({'wordCount': len(self.text.split()), 'words': self.text, 'score': sid.polarity_scores(self.text)['compound']})

		except Exception as e:
			print(str(e))
			raise e
