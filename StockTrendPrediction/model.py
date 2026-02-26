import yfinance as yf
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

def predict_trend(symbol="AAPL", days=60):
    symbol = symbol.upper().strip()
    usd_to_inr = 85.0  # approximate exchange rate

    # Detect market automatically
    if '.' not in symbol:
        # Default: try Indian market first
        test_symbol = symbol + '.NS'
        test_data = yf.download(test_symbol, period="5d", interval="1d")
        if not test_data.empty:
            symbol = test_symbol  # Use Indian stock (INR)
            currency = "₹"
        else:
            currency = "₹"  # Convert USD → INR
    elif symbol.endswith(('.NS', '.BO')):
        currency = "₹"
    else:
        currency = "₹"  # Convert USD → INR

    # Download data
    data = yf.download(symbol, period=f"{days}d", interval="1d")
    if data.empty:
        return {"error": f"No data found for symbol {symbol}"}

    data['Return'] = data['Close'].pct_change()
    data['SMA'] = data['Close'].rolling(window=5).mean()
    data['EMA'] = data['Close'].ewm(span=5, adjust=False).mean()
    data['Target'] = (data['Close'].shift(-1) > data['Close']).astype(int)
    data.dropna(inplace=True)

    X = data[['Return', 'SMA', 'EMA']]
    y = data['Target']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_scaled[:-1], y[:-1])

    last_input = X_scaled[-1].reshape(1, -1)
    pred = model.predict(last_input)[0]

    latest_price = float(data['Close'].iloc[-1].item())
    history = data.tail(30)

    # Convert USD to INR if needed
    if currency == "₹" and not symbol.endswith(('.NS', '.BO')):
        latest_price *= usd_to_inr
        history['Close'] *= usd_to_inr

    return {
        "symbol": symbol,
        "latest_price": round(latest_price, 2),
        "trend": "Up" if int(pred) == 1 else "Down",
        "dates": [str(date.date()) for date in history.index],
        "prices": history['Close'].squeeze().round(2).tolist(),
        "currency": currency
    }
