export const loadSumUpScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('sumup-card-widget-script')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = 'sumup-card-widget-script'
    script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('SumUp Widget konnte nicht geladen werden'))
    document.head.appendChild(script)
  })
}
