import { getReservationOptions, TrainAndReservationOption } from ".";

it("should return an empty array in case there is no available train", async function() {
  // GIVEN
  const getAvailableTrains = jest.fn().mockResolvedValueOnce([]);
  const getAvailableSeats = jest.fn().mockResolvedValueOnce([]);

  // WHEN
  const actual = await getReservationOptions(getAvailableTrains, getAvailableSeats);

  // THEN
  expect(actual).toEqual([]);
});

it("should return an array of 2 reservation options in case there is one available train with 2 seats left", async function() {
  // GIVEN

  const getAvailableTrains = jest.fn().mockResolvedValueOnce(["trainId"]);
  const getAvailableSeats = jest.fn().mockImplementationOnce(id =>
    id === "trainId"
      ? Promise.resolve([
          { coach: 1, seat: 1 },
          { coach: 1, seat: 2 }
        ])
      : Promise.resolve([])
  );

  // WHEN
  const actual = await getReservationOptions(getAvailableTrains, getAvailableSeats);

  // THEN
  const expected: TrainAndReservationOption[] = [
    {
      trainId: "trainId",
      seats: [
        { coach: 1, seat: 1 },
        { coach: 1, seat: 2 }
      ]
    }
  ];
  expect(actual).toEqual(expected);
});

it("should return an array of 3 reservation options in case there is one available train with 2 seats left and another with 1 seat left", async function() {
  // GIVEN
  const getAvailableTrains = jest.fn().mockResolvedValueOnce(["trainId_0", "trainId_1"]);
  const getAvailableSeats = jest.fn().mockImplementation(id => {
    switch (id) {
      case "trainId_0":
        return Promise.resolve([
          { coach: 1, seat: 1 },
          { coach: 1, seat: 2 }
        ]);
      case "trainId_1":
        return Promise.resolve([{ coach: 17, seat: 110 }]);
      default:
        return Promise.resolve([]);
    }
  });

  // WHEN
  const actual = await getReservationOptions(getAvailableTrains, getAvailableSeats);

  // THEN
  const expected: TrainAndReservationOption[] = [
    {
      trainId: "trainId_0",
      seats: [
        { coach: 1, seat: 1 },
        { coach: 1, seat: 2 }
      ]
    },
    {
      trainId: "trainId_1",
      seats: [{ coach: 17, seat: 110 }]
    }
  ];
  expect(actual).toEqual(expected);
});

it("should be resilient to failures of the second endpoint", async function() {
  // GIVEN
  const getAvailableTrains = jest.fn().mockResolvedValueOnce(["trainId_0", "trainId_1"]);
  const getAvailableSeats = jest.fn().mockImplementation(id => {
    switch (id) {
      case "trainId_0":
        return Promise.reject("Error 500");
      case "trainId_1":
        return Promise.resolve([{ coach: 17, seat: 110 }]);
      default:
        return Promise.resolve([]);
    }
  });

  // WHEN
  const actual = await getReservationOptions(getAvailableTrains, getAvailableSeats);

  // THEN
  const expected: TrainAndReservationOption[] = [
    {
      trainId: "trainId_1",
      seats: [{ coach: 17, seat: 110 }]
    }
  ];
  expect(actual).toEqual(expected);
});
