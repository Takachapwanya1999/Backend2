import { toast as notify } from 'react-toastify';

export const toast = {
  success: (msg) => notify.success(msg, { position: 'top-right', theme: 'colored', pauseOnHover: true }),
  error: (msg) => notify.error(msg, { position: 'top-right', theme: 'colored', pauseOnHover: true }),
  info: (msg) => notify.info(msg, { position: 'top-right', theme: 'colored', pauseOnHover: true }),
};
