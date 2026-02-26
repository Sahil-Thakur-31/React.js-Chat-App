import json
from flask import Flask, render_template, request, jsonify
import requests
from model import predict_trend

app = Flask(__name__)

with open('nse_stocks.json', 'r', encoding='utf-8') as f:
    nse_stocks = json.load(f)

with open('nasdaq_stocks.json', 'r', encoding='utf-8') as f:
    nasdaq_stocks = json.load(f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    symbol = data.get("symbol", "AAPL")
    days = data.get("days", 60)

    result = predict_trend(symbol, days)
    return jsonify(result)

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '').upper()
    if not query:
        return jsonify([])

    all_stocks = nse_stocks + nasdaq_stocks

    results = [stock for stock in all_stocks if query in stock['symbol'].upper() or query in stock['name'].upper()]
    return jsonify(results[:10])

if __name__ == "__main__":
    app.run(debug=True)
