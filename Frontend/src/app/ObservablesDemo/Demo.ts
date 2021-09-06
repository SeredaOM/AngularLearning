import { interval, Observable, Observer, of, OperatorFunction, pipe } from 'rxjs';
import { filter, map, timeout } from 'rxjs/operators';
import { NumberObserver } from './NumberObserver';

// Created basic observables demo based on https://angular.io/guide/observables
export class Demo {
  static numberObserver1 = new NumberObserver('1');
  static numberObserver2 = new NumberObserver('2');

  // Emit numbers in array with delay, which simulates external events
  static generateEvents(observer: Observer<number>, arr: number[], idx: number) {
    let timeoutId = setTimeout(() => {
      console.log('Emitting ' + arr[idx]);
      observer.next(arr[idx]);
      if (idx === arr.length - 1) {
        observer.complete();
      } else {
        Demo.generateEvents(observer, arr, ++idx);
      }
    }, 1000);

    return timeoutId;
  }

  static sequenceGeneratorSubscriber(observer: Observer<number>) {
    const seq = [1, 2, 3];
    // Will run through an array of numbers, emitting one value
    // per second until it gets to the end of the array.
    let timeoutId = Demo.generateEvents(observer, seq, 0);

    // Unsubscribe should clear the timeout to stop execution
    return {
      unsubscribe() {
        console.log('Unsubscribed');
        clearTimeout(timeoutId);
      },
    };
  }

  static multicastSequenceGeneratorSubscriber() {
    const seq = [1, 2, 3];
    // Keep track of each observer (one for every active subscription)
    const observers: Observer<unknown>[] = [];
    // Still a single timeoutId because there will only ever be one
    // set of values being generated, multicasted to each subscriber
    let timeoutId: any;

    // Return the subscriber function (runs when subscribe()
    // function is invoked)
    return (observer: Observer<unknown>) => {
      observers.push(observer);
      // When this is the first subscription, start the sequence
      if (observers.length === 1) {
        const internalMulticastObserver: Observer<number> = {
          next(val) {
            // Iterate through observers and notify all subscriptions
            observers.forEach((obs) => obs.next(val));
          },
          error() {
            /* Handle the error... */
          },
          complete() {
            // Notify all complete callbacks
            observers.slice(0).forEach((obs) => obs.complete());
          },
        };
        timeoutId = Demo.generateEvents(internalMulticastObserver, seq, 0);
      }

      return {
        unsubscribe() {
          // Remove from the observers array so it's no longer notified
          observers.splice(observers.indexOf(observer), 1);
          // If there's no more listeners, do cleanup
          if (observers.length === 0) {
            clearTimeout(timeoutId);
          }
        },
      };
    };
  }

  static basicDemo() {
    // Create a new Observable that will deliver the above sequence
    const observableSequence = new Observable(Demo.sequenceGeneratorSubscriber);
    observableSequence.subscribe(Demo.numberObserver1.getObserver());
    // After 1 1/2 second, subscribe again - does not miss any values
    setTimeout(() => {
      observableSequence.subscribe(Demo.numberObserver2.getObserver());
    }, 1500);

    //  let 1st example finish and start in 5 seconds
    setTimeout(() => {
      // Create a new Observable that will deliver the above sequence
      const observableMulticastSequence = new Observable(Demo.multicastSequenceGeneratorSubscriber());

      // Subscribe starts the clock, and begins to emit after 1 second
      observableMulticastSequence.subscribe(Demo.numberObserver1.getObserver());

      // After 1 1/2 seconds, subscribe again (should "miss" the first value).
      setTimeout(() => {
        observableMulticastSequence.subscribe(Demo.numberObserver2.getObserver());
      }, 1500);
    }, 5000);

    console.log(`Completed preparation`);
  }

  static operatorsDemo() {
    const nums: Observable<number> = of(1, 2, 3, 4, 5, 6, 7, 8, 9);

    const squareValues: OperatorFunction<number, number> = map((val: number) => val * val);
    const squareOddVals: OperatorFunction<number, number> = pipe(
      filter((n: number) => n % 2 !== 0),
      squareValues
    );
    const squaredNums: Observable<number> = squareOddVals(nums);

    console.log(`Subscribe to the operator (which might or might not have pipe inside):`);
    squareValues(nums).subscribe((x) => console.log(x));
    squaredNums.subscribe(new NumberObserver('3').getObserver());

    console.log(`Apply 'pipe' to observable, subscribe to 'pipe':`);
    nums
      .pipe(
        filter((n: number) => n % 2 !== 0),
        squareValues,
        filter((n: number) => n % 2 !== 0)
      )
      .subscribe((x) => console.log(x));
  }

  static demoAll() {
    Demo.basicDemo();
    Demo.operatorsDemo();
  }
}
