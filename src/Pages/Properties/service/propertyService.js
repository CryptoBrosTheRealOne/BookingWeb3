export const loadPropertyDetails = async (contract, propertyId) => {
  let property = await contract.methods.getProperty(propertyId).call();
  return property;
};

export const subscribeToReservationCreated = (contract, callback) => {
  if (!contract || !contract.events) {
    console.error("Contract not initialized");
    return;
  }
  const eventSubscription = contract.events.ReservationCreated({
    fromBlock: "latest",
  });
  const sub = eventSubscription
    .on("data", (event) => {
      callback(event.returnValues);
    });

  return eventSubscription;
};

export const subscribeToPropertyCreated = (contract, callback) => {
  if (!contract || !contract.events) {
    console.error("Contract not initialized");
    return;
  }
  const eventSubscription = contract.events.PropertyAdded({
    fromBlock: "latest",
  });
  const sub = eventSubscription
    .on("data", (event) => {
      callback(event.returnValues);
    });

  return eventSubscription;
};

export const subscribeToPropertyRemoved = (contract, callback) => {
  if (!contract || !contract.events) {
    console.error("Contract not initialized or contract.events is undefined");
    return;
  }

  const eventSubscription = contract.events
    .PropertyRemoved({
      fromBlock: "latest",
    })
    .on("data", (event) => {
      callback(event.returnValues);
    });

  return eventSubscription;
};
