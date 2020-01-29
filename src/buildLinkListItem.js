const buildLinkListItem = (linkSrc, linkText) => {
  let listItem = document.createElement('li');

  listItem.setAttribute('class', 'list-item');

  let linkItem = document.createElement('a');
  let textNode = document.createTextNode(linkText);

  linkItem.setAttribute('href', linkSrc);
  linkItem.setAttribute('rel', 'noopener');
  linkItem.setAttribute('target', '_blank');

  linkItem.appendChild(textNode);

  listItem.appendChild(linkItem);

  return listItem;
}