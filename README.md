# async-train-reservation-js

A kata inspired by Emily Bache's train reservation kata, but quite modified.

## Your job

Here we want to implement a train reservation service that allows a customer to search all the possible reservations on all the trains to go from A to B at a given date with for a given number of passengers and the desired class (1st/2nd). For that purpose, we rely on 2 endpoints:

- 1st endpoint (`/availableTrains`): provided with an origin, a destination and a date, it responds with a list of train ids. Those are all the trains that go from origin to destination at that date, whether there are available seats or not.
- 2nd endpoint (`/availableSeats`): provided with a train id, the number of passengers and the desired class (1st/2nd), it responds with an array of the corresponding seats.

Your task is to provide an implementation of the train reservation service. Your implementation should be resilient to errors in the 2nd endpoint, meaning that if `/availableSeats` is called many times and fails once, the results of the other calls must still be served.

## Installation

```text
git clone https://github.com/mathieueveillard/async-train-reservation-js.git
cd async-train-reservation-js
npm install && npm run start:api
```

## Development

```text
npm test
```
