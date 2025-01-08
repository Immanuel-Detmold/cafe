import Open from './Open/Open'

const ClosedOrdersToday = () => {
  return (
    <div>
      <Open statusList={['finished']} paymentPage={false} />
    </div>
  )
}

export default ClosedOrdersToday
