const OrderEventsService = require('../common/services/OrderEventsService')

const handler = async () => {
  const ebService = new OrderEventsService()
  const order1 = {
    orderId: 666,
    client: 'Rick Sanchez',
    email: 'RickSanchez@rickandmorty.com',
    date: '2021-04-05',
    paid: 77.77,
    product: 'Serverless Course'
  }

  const order2 = {
    orderId: 123,
    client: 'Morty Smith',
    email: 'MortySmith@rickandmorty.com',
    date: '2021-04-06',
    paid: 24.89,
    product: 'DataLake Course'
  }

  const promise1 = ebService.putEventOrderPurchased(order1)
  const promise2 = ebService.putEventOrderPurchased(order2)
  await Promise.all([promise1, promise2])
  console.log('Finished')

  return 'done'
}

module.exports = { handler }
