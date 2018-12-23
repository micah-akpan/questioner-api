import { omitProps } from '../utils';

const meetups = [
  {
    id: 1,
    topic: 'Meetup 1',
    createdOn: new Date(),
    location: 'Meetup location 1',
    happeningOn: new Date(),
    images: ['image1.jpeg', 'image2.jpg'],
    tags: ['']
  }
];

export default {

  getAllMeetups(req, res) {
    return res.status(200).send({
      status: 200,
      data: meetups
    });
  },

  createNewMeetup(req, res) {
    const {
      location, images, topic, happeningOn, tags
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
      tags
    };

    meetups.push(newMeetup);

    const mRecord = omitProps(newMeetup, ['createdOn', 'images']);


    return res.status(201).send({
      status: 201,
      data: [mRecord]
    });
  },

  getSingleMeetup(req, res) {
    const meetupRecord = meetups.filter(
      meetup => String(meetup.id) === req.params.id
    )[0];

    let mRecord;

    if (meetupRecord) {
      mRecord = omitProps(meetupRecord, ['createdOn', 'images']);
    } else {
      return res.status(404)
        .send({
          status: 404,
          error: `The requested meetup with the id: ${req.params.id} does not exist`
        });
    }
    return res.status(200)
      .send({
        status: 200,
        data: [mRecord],
      });
  },
};
