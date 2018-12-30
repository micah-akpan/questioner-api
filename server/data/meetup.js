import { getFutureDate } from '../utils';

const meetups = JSON.stringify([
  {
    id: 1,
    topic: 'Meetup 1',
    createdOn: new Date(),
    location: 'Meetup location 1',
    happeningOn: new Date(),
    images: ['image1.png', 'image2.jpg'
    ],
    tags: ['tech', 'javascript', 'tree shaking', 'webpack']
  },
  {
    id: 2,
    topic: 'Meetup 2',
    createdOn: new Date(),
    location: 'Meetup location 2',
    happeningOn: getFutureDate(3),
    images: ['image1.png', 'image2.jpg'
    ],
    tags: ['food festival', 'food', 'everything food', 'just food']
  },
  {
    id: 3,
    topic: 'Meetup 3',
    createdOn: new Date(),
    location: 'Meetup location 3',
    happeningOn: new Date(),
    images: ['image1.png', 'image2.jpg'
    ],
    tags: ['crypto', 'ico', 'money', 'tokens', 'bitcoin']
  },

  {
    id: 4,
    topic: 'Meetup 4',
    createdOn: new Date(),
    location: 'Meetup location 4',
    happeningOn: getFutureDate(2),
    images: [],
    tags: []
  },

  {
    id: 5,
    topic: 'Meetup 5',
    createdOn: new Date(),
    location: 'Meetup location 5',
    happeningOn: getFutureDate(2),
    images: [],
    tags: []
  }
]);

export default meetups;
