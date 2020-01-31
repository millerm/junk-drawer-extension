/**
 * Takes a link source and display text and returns an `li` dom node
 * TODO: Refactor to accept a config as an argument. This should also probably be a class.
 *
 * @param {String} linkSource - The `href` value for the link
 * @param {String} displayText - The text that should be displayed as the link title
 */
const linkFactory = (linkSource, displayText) => {
  let listItem = document.createElement('li');

  listItem.setAttribute('class', 'list-item');

  let linkItem = document.createElement('a');
  let textNode = document.createTextNode(displayText);

  linkItem.setAttribute('href', linkSource);
  linkItem.setAttribute('rel', 'noopener');
  linkItem.setAttribute('target', '_blank');

  linkItem.appendChild(textNode);

  listItem.appendChild(linkItem);

  return listItem;
}