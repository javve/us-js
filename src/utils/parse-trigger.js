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
        stateName: trigger.trim()
      });
    } else {
      let [containerName, stateName] = triggerParts;
      results.push({
        stateName: stateName.trim(),
        containerName: containerName.trim()
      });
    }
  }
  return results;
}
