import { Router } from 'express';

const router = Router();
const meetups = [
  {
    id: 1,
    topic: 'Meetup 1',
    createdOn: new Date(),
    location: 'Meetup location 1',
    happeningOn: new Date(),
    images: ['image1.jpeg', 'image2.jpg'],
    Tags: ['']
  }
];

router.post('/meetups', (req, res) => {
  const {
    location, images, topic, happeningOn, Tags
  } = req.body;
  const lastMeetupId = meetups[meetups.length - 1].id;

  if (!topic || !location || !happeningOn) {
    return res.status(400).send({
      status: 400,
      error: 'The topic, location and happeningOn fields are required fields'
    });
  }

  if (new Date(happeningOn).getTime() < new Date().getTime()) {
    return res.status(422).send({
      status: 422,
      error: 'Meetup Date provided is in the past, provide a future date'
    });
  }

  const newMeetup = {
    id: lastMeetupId + 1,
    createdOn: new Date(),
    location,
    images,
    topic,
    happeningOn,
    Tags
  };

  return res.status(201).send({
    status: 201,
    data: [...meetups, newMeetup]
  });
});

export default router;
