import React from 'react';
import List from './List.jsx';

export default function Content({ lists }) {
  console.log(`----${lists}`)
  return (
   <div>
     lists.map((list) => <List content={list} />)
   </div> 
  )
}