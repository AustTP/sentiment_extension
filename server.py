from flask import Flask
from flask import request
import NLP as NLP
import json

app = Flask(__name__)

@app.route('/', methods = ['POST'])
def getSummary():
    if request.method == 'POST':
        body = json.loads(request.data)
        response = ''

        try:
            nlp = NLP.NLP(body)
            response = json.dumps({
                "Summary": json.loads(nlp.summary)
            })
            print(response)
        except Exception as e:
            print(str(e))
            response = json.dumps({
                "Summary": "Something went wrong."
            })

        return response

app.run(host = '127.0.0.1', debug = True, port = 8000)