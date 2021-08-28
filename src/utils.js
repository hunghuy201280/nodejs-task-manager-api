const canUpdate = (inputFields, allowedUpdate) => {
  return inputFields.every((it) => allowedUpdate.includes(it));
};

module.exports = {
  canUpdate,
};
