import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const router = Router();

// Utility function to log messages with timestamp
const logWithTimestamp = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

router.get('/', (req, res) => {
  logWithTimestamp('GET / - Fetching all messages');
  return res.send(Object.values(req.context.models.messages));
});

router.get('/:messageId', (req, res) => {
  const messageId = req.params.messageId;
  logWithTimestamp(`GET /${messageId} - Fetching message with ID: ${messageId}`);
  return res.send(req.context.models.messages[req.params.messageId]);
});

router.post('/', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id,
  };

  req.context.models.messages[id] = message;

  return res.send(message);
});

router.delete('/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = req.context.models.messages;

  req.context.models.messages = otherMessages;

  return res.send(message);
});

router.put('/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message
  } = req.context.models.messages;

  const updatedMessage = {
    ...message,
    text: req.body.text
  };

  req.context.models.messages[req.params.messageId] = updatedMessage;

  return res.send(updatedMessage);
})

export default router;
