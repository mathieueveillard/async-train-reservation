import * as allSettled from "promise.allsettled";
import { PromiseResult, PromiseResolution } from "promise.allsettled";

export type TrainId = string;

export interface ReservationOption {
  coach: number;
  seat: number;
}

export interface TrainAndReservationOption {
  trainId: TrainId;
  seats: ReservationOption[];
}

export interface GetAvailableTrainsApi {
  (): Promise<TrainId[]>;
}

export interface GetAvailableSeatsApi {
  (trainId: string): Promise<ReservationOption[]>;
}

export async function getReservationOptions(
  getAvailableTrains: GetAvailableTrainsApi,
  getAvailableSeats: GetAvailableSeatsApi
): Promise<TrainAndReservationOption[]> {
  const availableTrainsIds = await getAvailableTrains();
  return allSettled(
    availableTrainsIds.map(trainId => {
      return getAvailableSeats(trainId).then(options => ({
        trainId,
        seats: options
      }));
    })
  ).then(results =>
    results
      .filter(isFulfilled)
      .map(getOptions)
      .reduce(push, [])
  );
}

function isFulfilled(
  result: PromiseResult<TrainAndReservationOption>
): result is PromiseResolution<TrainAndReservationOption> {
  return result.status === "fulfilled";
}

function getOptions({ value }: PromiseResolution<TrainAndReservationOption>): TrainAndReservationOption {
  return value;
}

function push<T>(acc: T[], cur: T): T[] {
  return [...acc, cur];
}
