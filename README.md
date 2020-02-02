# react-hook-pagination

React Hook for implementing load more on scroll for list and tables in React.
* Easy to use hook API, hook your list/table to a scroll element and wait for the hook to tell you when to fetch next batch of data!
* Initial fetch till scroll appears
* Customise load behaviour via parameters (fetchSize, limit etc)
* Configure custom loader, end of list behavior (show spinner, loader icons etc)
* Externalized fetch (You define how to fetch, hook decides when to fetch)

[![NPM](https://img.shields.io/npm/v/react-pagination.svg)](https://www.npmjs.com/package/react-hook-pagination) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Website

Find Demos and Docs [here](https://sumedh22.github.io/react-hook-pagination/)

## Install

```bash
npm install --save react-hook-pagination
```

## Usage

```jsx
import React, { useState, useRef, useEffect } from "react";
import person from "./mock.json";
import useLoadMoreOnScroll from 'react-hook-pagination';


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
