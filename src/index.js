import { useState, useEffect } from "react";

const useLoadMoreOnScroll = props => {
    let { fetchSize = 10, limit = 500, scroller, mode = 'error', minDelta = 25 } = props;
    if (!scroller) throw new Error(`Cannot use useLoadMoreOnScroll without specifying a scroller. \n scroller MUST be an HtmlDOMElement acquired via useRef() or React.ref()`)
    let l = () => {};
    if (mode === 'debug') {
        l = console.log;
    }
    const [lastFetchSize, setLastFetchSize] = useState(fetchSize);
    const [delta, setDelta] = useState(999);
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('none');
    const [doneFetching, setDoneFetching] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [hasScrollbar, setHasScrollbar] = useState(false);
    const [initFetchCount, setInitFetchCount] = useState(0);
    const [lastCount, setLastCount] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);


    useEffect(() => {
        if (!isFetching &&
            !hasScrollbar &&
            lastCount !== initFetchCount &&
            !doneFetching
        ) {
            l(`Trying to  make the scrollbar visible : ${initFetchCount}`);
            setLastFetchSize(lastFetchSize + fetchSize);
        }
        setLastCount(initFetchCount);
    }, [
        initFetchCount,
        isFetching,
        hasScrollbar,
        lastFetchSize,
        fetchSize,
        doneFetching
    ]);

    useEffect(() => {
        if (!hasScrollbar && !isFetching) {
            setInitFetchCount(initFetchCount + 1);
        }
    }, [isFetching, hasScrollbar]);

    useEffect(() => {
        const scrollElement = scroller.current;
        setHasScrollbar(
            scrollElement.scrollHeight > scrollElement.getBoundingClientRect().height
        );
    }, [isFetching]);

    useEffect(() => {
        const scrollElement = scroller.current;
        let previousScroll = 0;
        l(`scroll listener added to element`, scrollElement);
        const scrollHandler = scrollElement.addEventListener("scroll", e => {
            setScrollTop(scrollElement.scrollTop);
            if (previousScroll < scrollElement.scrollTop) {
                setScrollDirection("down");
            } else {
                setScrollDirection("up");
            }
            previousScroll = scrollElement.scrollTop;
        });
        return () => {
            l(`scroll listener removed from element`, scrollElement);
            scrollElement.removeEventListener("scroll", scrollHandler);
        };
    }, [scroller]);

    useEffect(() => {
        const scrollElement = scroller.current;
        if (scrollDirection === "down") {
            setDelta(scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.getBoundingClientRect().height);
        }
    }, [scrollTop, scrollDirection, isFetching]);

    useEffect(() => {
        l(`delta value ${delta} and scroll direction ${scrollDirection}`)
        if (delta <= minDelta && !isFetching && !doneFetching) {
            setLastFetchSize(lastFetchSize + fetchSize);
        }
    }, [delta, doneFetching]);

    useEffect(() => {
        if (lastFetchSize <= limit) {
            setStart(lastFetchSize - fetchSize > 0 ? lastFetchSize - fetchSize : 0);
            setEnd(lastFetchSize);
            l(`Requesting fetch for start ${start} end ${end}`);
        } else if (
            limit - lastFetchSize + fetchSize > 0 &&
            limit - lastFetchSize <= fetchSize
        ) {
            setStart(lastFetchSize - fetchSize);
            setEnd(limit);
            l(`Requesting fetch for start ${start} end ${end}`);
        } else {
            l(`Reached max limit set ${limit}`)
            setDoneFetching(true);
        }
    }, [lastFetchSize, limit, fetchSize]);
    const forceDonefetching = () => {
        l(`User requested stop fetching`);
        setDoneFetching(true)
    }
    return {
        start,
        end,
        isFetching,
        doneFetching,
        setIsFetching,
        forceDonefetching
    };
};

export default useLoadMoreOnScroll;