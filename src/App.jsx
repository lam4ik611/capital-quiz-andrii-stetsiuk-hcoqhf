import { useEffect, useMemo, useState } from 'react';
import './App.css';

// Hi there, so here's my sample of the task. Here I only want to demonstrate my logical solutions, approaches and code style in general, so that's why there's no any additional things such as React-Query, TS or using endpoints.

// this structure is used to have a quick access to values by keys in terms of Big O Notation
const defaultData = {
  England: 'London',
  Ukraine: 'Kyiv',
  Poland: 'Warsaw',
  NewZealand: 'Wellington',
  Norway: 'Oslo',
};

const defaultMatch = {
  country: '',
  capital: '',
};

function App() {
  let timer = null;

  const [data, setData] = useState(defaultData);
  const [currentMatch, setCurrentMatch] = useState(defaultMatch);
  const [isLocked, setIsLocked] = useState(false);
  const [isBannerShowed, setIsBannerShowed] = useState(false);

  // the variable returns a boolen value if we have both country and capital selected
  const isCurrentMatchFilled = Boolean(
    currentMatch.country && currentMatch.capital
  );
  // we check if such a key exists and if so, then if its value equals the current capital
  const isCurrentMatchCorrect =
    data[currentMatch.country] === currentMatch.capital;

  useEffect(() => {
    handleBanner();
  }, [data]);

  useEffect(() => {
    handleMatch();
  }, [currentMatch]);

  const handleBanner = () => {
    // if there's no data left, then we show a banner
    setIsBannerShowed(!Object.keys(data).length);
  };

  const handleButton = (item) => {
    setCurrentMatch((prevCurrentMatch) => ({
      ...prevCurrentMatch,
      // also the benefit of that structure is that we can check if it's a country or a capital just by checking if such a key (country) exists, if not, then it's a capital
      [data[item] ? 'country' : 'capital']: item,
    }));
  };

  const handleMatch = () => {
    if (!isCurrentMatchFilled) return;

    // to ensure we cleared previous timeout before calling a new one
    if (timer) {
      clearTimeout(timer);
    }

    if (isCurrentMatchCorrect) {
      setData((prevData) => {
        const { [currentMatch.country]: deletedCountry, ...rest } = prevData;
        return rest;
      });
      setCurrentMatch(defaultMatch);

      return;
    }

    setIsLocked(true);

    timer = setTimeout(() => {
      setCurrentMatch(defaultMatch);
      setIsLocked(false);
    }, 3000);
  };

  const handleStart = () => {
    setData(defaultData);
    setIsBannerShowed(false);
  };

  // useMemo is used to shuffle the array only on data state changing and not on every re-render
  const buttons = useMemo(
    () =>
      [...Object.keys(data), ...Object.values(data)].sort(
        () => Math.random() - 0.5
      ),
    [data]
  );

  return (
    <div style={{ position: 'relative' }}>
      {buttons.map((item) => (
        <button
          type="button"
          disabled={isLocked}
          onClick={() => handleButton(item)}
          style={{
            // checks if the current item is in currentMatch, means if it's clicked
            ...(Object.values(currentMatch).some((value) => value === item) && {
              backgroundColor:
                // if so, then we check we have both values clicked and if the current match is correct
                isCurrentMatchFilled && !isCurrentMatchCorrect ? 'red' : 'blue',
            }),
          }}
        >
          {item}
        </button>
      ))}
      {isBannerShowed && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'pink',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3>Congratulations!</h3>
          <button type="button" onClick={handleStart}>
            Start again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
