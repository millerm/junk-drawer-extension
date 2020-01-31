/**
 * Takes a link source and display text and returns an `li` dom node
 *
 * TODO: Add `x` delete button
 * TODO: This should also probably be a class.
 *
 * @param {String} id - The firestore id
 * @param {String} href - The `href` value for the link
 * @param {String} displayText - The text that should be displayed as the link title
 */
const linkFactory = ({ id, href, displayText }) => {
  let listItem = document.createElement('li');

  listItem.setAttribute('class', 'list-item');

  let linkItem = document.createElement('a');
  let textNode = document.createTextNode(displayText);

  linkItem.setAttribute('href', href);
  linkItem.setAttribute('rel', 'noopener');
  linkItem.setAttribute('target', '_blank');

  linkItem.appendChild(textNode);

  listItem.appendChild(linkItem);

  return listItem;
}