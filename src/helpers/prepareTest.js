export default function (rawTest, visibilityData = {}) {
  const { title, normalFrom, normalTo, results  } = rawTest

  let res = {
    title,
    normalRange: {
      from: normalFrom || '',
      to: normalTo || '',
    },
    results,
    isHidden: false,
    shownPeriod: {
      start: visibilityData.shownPeriod?.start || results[0]?.date || '',
      end: visibilityData.shownPeriod?.end || results[results.length - 1]?.date || '',
    },
  }

  return {...res, ...visibilityData}
}
