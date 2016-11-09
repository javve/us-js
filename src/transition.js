module.exports = () => {
  let el = document.createElement('fakeelement')
  , endName = ''
  , endTransitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  };

  for (let t in endTransitions){
    if (el.style[t] !== undefined) {
      endName = endTransitions[t];
    }
  }

  return {
    end: endName
  };
}
