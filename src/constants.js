
const SELECTORS = {
  MEDIA_LIST: 'media-list',
  TEXT_SELECTIONS_LIST: 'text-selections-list',
  LINKS_LIST: 'links-list',
  PAGES_LIST: 'pages-list',
  HEADER_TITLE: 'header-title'
};

const COLLECTIONS = {
  PAGE_SELECTIONS: 'page-selections',
  TEXT_SELECTIONS: 'text-selections',
  MEDIA_REFERENCES: 'media-references',
  LINK_REFERENCES: 'link-references',
}

const COLLECTIONS_ID_NAME_MAP = {
  [COLLECTIONS.PAGE_SELECTIONS]: 'pages-list',
  [COLLECTIONS.TEXT_SELECTIONS]: 'text-selections-list',
  [COLLECTIONS.MEDIA_REFERENCES]: 'media-list',
  [COLLECTIONS.LINK_REFERENCES]: 'links-list'
};

const ACTIONS = {
  INSERT: 'insert'
}
