import re
import json
from scipy.interpolate import interp1d

import operator
# set(stopwords.words('english'))

# Synonyms should be treated the same way. Stemmer is an algorithm to bring words to its root word.
# from nltk.stem import PorterStemmer

from nltk.sentiment.vader import SentimentIntensityAnalyzer
sid = SentimentIntensityAnalyzer()

class NLP:
	def __init__(self, html):	
		self.text = html['text']
		
		self.summary = ''

		# Stemmer (puts pluralized, tensed words/verbs into their root form eg: agreed -> agree, flies -> fli)
		# self.ps = PorterStemmer()
		# self.stemSentence()

		# self.stopWords = set(stopwords.words('english'))

		self.createSummary()

	def applyBackspace(self):
		while True:
			# If you find a character followed by a backspace, remove both
			temp = re.sub('.\b', '', self.text, count = 1)
			
			if len(self.text) == len(temp):
				# now remove any backspaces from beginning of string
				return re.sub('\b+', '', temp)

			self.text = temp
				
	# def stemSentence(self):
		# word = self.ps.stem(self.text)
		# self.text = word

	def createSummary(self):
		try:
			self.applyBackspace()
			
			score = sid.polarity_scores(self.text)['compound']
			range = interp1d([-1,1],[0,1])
            
			self.summary = json.dumps({'wordCount': len(self.text.split()), 'words': self.text, 'score': float(range(score))})

		except Exception as e:
			print(str(e))
			raise e
