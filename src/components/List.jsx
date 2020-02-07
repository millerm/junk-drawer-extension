import React from 'react';
import ListItem from './ListItem.jsx';

export default function List({ list }) {
  console.log(`list is ${list}`)
  return (
    <ul>
      {list.map((item) => <ListItem listItem={item} />)}
    </ul>
  )
}