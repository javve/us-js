module.exports = {
  wrap: el => {
    let div = document.createElement('div');
    el.parentNode.insertBefore(div, el);
    div.appendChild(el);
    return el;
  },
  unwrap: el => {
    let container = el.parentNode,
      parentsParent = container.parentNode;
    parentsParent.insertBefore(el, container);
    parentsParent.removeChild(container);
    return el;
  }
};
