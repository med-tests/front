export default function (parameter) {
  return {
    id: parameter.id,
    title: parameter.title,
    normalRange: {
      from: parameter.normalFrom,
      to: parameter.normalTo,
    },
    isHidden: parameter.isHidden,
    shownPeriod: {
      start: parameter.showFrom,
      end: parameter.showTo,
    },
    position: parameter.position,
    results: parameter.results,
  }
}
