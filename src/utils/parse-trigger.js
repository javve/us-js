module.exports = (str) => {
  if (!str) {
    return [];
  }
  let triggers = (str || '').split(',')
    , results = [];

  for (let trigger of triggers) {
    let triggerParts = trigger.split('.');
    if (triggerParts.length == 1) {
      results.push({
        stateName: trigger
      });
    } else {
      let [containerName, stateName] = triggerParts;
      results.push({
        stateName, containerName
      });
    }
  }
  return results;
}
