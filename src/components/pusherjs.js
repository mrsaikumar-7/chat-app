import Pusher from 'pusher-js';

const pusher = new Pusher('2ad13bef5022d983147b', {
    cluster: 'ap2',
    encrypted: true
  });
export default pusher