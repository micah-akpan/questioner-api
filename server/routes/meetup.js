import { Router } from 'express';

const router = Router();
const meetups = [];

router.post('/meetups', (req, res) => {
  const {
    location, images, topic, happeningOn, Tags
  } = req.body;
  const lastMeetupId = meetups[meetups.length - 1] ? meetups[meetups.length - 1].id : 0;

  if (!topic || !location || !happeningOn) {
    return res.status(400)
      .send({
        status: 400,
        error: 'The topic, location and happeningOn fields are required fields'
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

  return res.status(201)
    .send({
      status: 201,
      data: [...meetups, newMeetup]
    });
});

export default router;
