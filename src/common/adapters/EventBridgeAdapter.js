const EventBridge = require('aws-sdk/clients/eventbridge')

module.exports = class EventBridgeAdapter {
  constructor() {
    this.ebClient = new EventBridge({
      region: process.env.region
    })
  }

  async putEvent(params) {
    console.log(`Sending events to EventBridge: ${params.Entries[0].EventBusName}`)
    const response = await this.ebClient.putEvents(params).promise()
    console.log('Event Bus response', response)
    if (response.FailedEntryCount) {
      console.log('Error publishing one or more events to EventBridge', params);
      throw new Error('Error publishing one or more events to EventBridge');
    }
    return response
  }
}
