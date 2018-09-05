export const baseUrl = (req) => {
  if (typeof window === 'undefined') {
    return req ? req.protocol + '://' + req.get('host') : ''; // eslint-disable-line
  } else {
    return window.location.origin; // eslint-disable-line
  }
};
