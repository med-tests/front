export default function (test) {
  return {
    id: test.id,
    title: test.title,
    normalRange: {
      from: test.normalFrom || '',
      to: test.normalTo || '',
    },
    isHidden: test.isHidden,
    shownPeriod: {
      start: test.showFrom || '',
      end: test.showTo || '',
    },
    position: test.position,
    order: 0,
    results: test.results,
  }
}
