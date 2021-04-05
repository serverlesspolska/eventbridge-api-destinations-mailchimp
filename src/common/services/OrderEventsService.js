const EventBridgeAdapter = require('../adapters/EventBridgeAdapter')

const EventTypes = {
  ORDER_COURSE_SERVERLESS: 'ORDER_COURSE_SERVERLESS',
  ORDER_COURSE_DATALAKE: 'ORDER_COURSE_DATALAKE',
}

module.exports = class OrderEventsService {
  constructor(eventBridgeAdapter) {
    this.client = eventBridgeAdapter || new EventBridgeAdapter()
  }

  async putEventOrderPurchased(order) {
    this.order = order
    const { eventBusName } = process.env
    if (!eventBusName) {
      throw new Error('EventBusName not specified')
    }
    const { tagId, eventType } = this.parametrizeByOrderProduct()
    console.log(`Sending ${eventType} event to EventBus`)
    const payload = {
      mcTagId: tagId,
      ...order,
    }
    const params = {
      Entries: [{
        EventBusName: eventBusName,
        Source: 'eb-api-dest-sample',
        DetailType: eventType,
        Detail: JSON.stringify(payload),
      }]
    }
    return this.client.putEvent(params)
  }

  // eslint-disable-next-line class-methods-use-this
  parametrizeByOrderProduct() {
    const { mcTagServerless, mcTagDataLake } = process.env
    switch (this.order.product) {
      case 'Serverless Course':
        return {
          tagId: mcTagServerless,
          eventType: EventTypes.ORDER_COURSE_SERVERLESS
        }
      case 'DataLake Course':
        return {
          tagId: mcTagDataLake,
          eventType: EventTypes.ORDER_COURSE_DATALAKE
        }
      default:
        throw new Error(`Unrecognized product ${this.order.product}`)
    }
  }
}
