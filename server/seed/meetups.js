import { getFutureDate } from '../utils';

export default [
  {
    topic: 'meetup topic 1',
    location: 'meetup locaton 1',
    happeningOn: getFutureDate(3),
    maxNumberOfAttendees: 120,
    tags: ['meetup 1', 'next']
  },
  {
    topic: 'meetup topic 2',
    location: 'meetup location 2',
    happeningOn: getFutureDate(4),
    maxNumberOfAttendees: 70,
    tags: ['meetup 2', 'trending']
  },
  {
    topic: 'meetup topic 3',
    location: 'meetup location 3',
    happeningOn: getFutureDate(4),
    maxNumberOfAttendees: 70,
    tags: ['meetup 3', 'trending']
  },
  {
    topic: 'meetup topic 4',
    location: 'meetup location 4',
    happeningOn: getFutureDate(5),
    maxNumberOfAttendees: 80,
    tags: ['meetup 4', 'trending']
  },
  {
    topic: 'meetup topic 5',
    location: 'meetup location 5',
    happeningOn: getFutureDate(7),
    maxNumberOfAttendees: 100,
    tags: ['meetup 5', 'trending']
  }
];
