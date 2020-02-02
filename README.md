# react-pagination

> Hook for implementing load more on scroll for list and tables in React

[![NPM](https://img.shields.io/npm/v/react-pagination.svg)](https://www.npmjs.com/package/react-pagination) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-pagination
```

## Usage

```jsx
import React, { useState, useRef, useEffect } from "react";
import person from "./mock.json";
import useLoadMoreOnScroll from 'react-pagination';


const List = props => {
  const fetchSize = 20;
  const limit = 1000;
  const ulElement = useRef();
  const [data, setData] = useState([]);
  const {
    start,
    end,
    isFetching,
    doneFetching,
    setIsFetching,
    forceDonefetching
  } = useLoadMoreOnScroll({ fetchSize, scroller: ulElement, limit:limit, mode:'error' });

  useEffect(() => {
    if (start !== end) fetchHandler(start, end);
  }, [start, end]);

  /**
   *
   * @param {Number} start : Index to start fetching from or commonaly called 'Offset'
   * @param {Number} end : Last index
   */
  const fetchHandler = (start, end) => {
    setIsFetching(true);
    setTimeout(() => {
      setData([...data, ...person.slice(start, end)]);
      
      setIsFetching(false);
    }, 2000);
  };

  return (
    <div className="list" ref={ulElement} style={{ height: "400px", overflow: "auto" }}>
        {data.map((i, idx) => (
          <div
          className="list-item"
            key={idx}
          >{` ${i.first_name} ${i.last_name}`}</div>
        ))}
        {isFetching && <div className="list-item-loader"></div>}
        {doneFetching && <div className="list-item-done">Done!</div>}
      </div>
  );
};
export default List;

```

## License

MIT © [sumedh22](https://github.com/sumedh22)
