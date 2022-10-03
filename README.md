# CapitalOne Rewards Calculator API

Instructions to user API:
```
npm i
node app.js
```

Open browser
URL: http://localhost:8000/api-docs/

Use the UI to send requests.
1. Change the request body if necessary by clicking the `try it out` button
2. View the response below

OR use curl:

```
curl -X 'POST' \
  'http://localhost:8000/api/rewards' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "T01": {
    "date": "2021-05-01",
    "merchant_code": "sportcheck",
    "amount_cents": 500
  },
  "T02": {
    "date": "2021-05-02",
    "merchant_code": "tim_hortans",
    "amount_cents": 1000
  },
  "T03": {
    "date": "2021-05-03",
    "merchant_code": "the_bay",
    "amount_cents": 500
  }
}'
```