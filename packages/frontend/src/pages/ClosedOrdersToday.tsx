import Open from './Open/Open'

const ClosedOrdersToday = () => {
  return (
    <div>
      <Open statusList={['finished']} />
    </div>
  )
}

export default ClosedOrdersToday
