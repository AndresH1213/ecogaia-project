module.exports = () => {
  return process.env.npm_lifecycle_event?.includes('start:dev');
};
