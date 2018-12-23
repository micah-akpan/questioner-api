import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Questioner API'
  });
});

export default router;
