/**
 * Takes a link source and display text and returns an `li` dom node
 *
 * TODO: This should also probably be a class.
 *
 * @param {String} config.id - The firestore id
 * @param {String} config.href - The `href` value for the link
 * @param {String} config.displayText - The text that should be displayed as the link title
 * @param {String} config.collection - The collection the record is from
 */
function linkFactory ({ id, href, displayText, collection }) {
  const listItem = document.createElement('li');

  listItem.setAttribute('class', 'list-item');
  listItem.setAttribute('value', id);
  listItem.setAttribute('data-collection', collection);
  // Build the link
  const linkItem = document.createElement('a');
  const linkText = document.createTextNode(displayText);

  linkItem.setAttribute('href', href);
  linkItem.setAttribute('rel', 'noopener');
  linkItem.setAttribute('target', '_blank');

  linkItem.appendChild(linkText);

  // Build the delete button
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.setAttribute('class', 'delete-button');
  

  listItem.appendChild(linkItem);
  listItem.appendChild(deleteButton)

  return listItem;
}