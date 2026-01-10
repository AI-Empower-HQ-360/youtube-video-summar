import autocannon from 'autocannon'

// Simple load test against backend summary route
const target = process.env.API_BASE_URL || 'http://localhost:3001/api'

const url = `${target}/summary/generate`
console.log(`Starting load test: ${url}`)

const transcript = 'a'.repeat(150) // minimum length per validator

const instance = autocannon({
  url,
  method: 'POST',
  connections: 50,
  pipelining: 1,
  duration: 20,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transcript }),
})

autocannon.track(instance)

instance.on('done', (result) => {
  console.log('Load test completed')
  console.log({
    requests: result.requests.average,
    throughput: result.throughput.average,
    errors: result.errors,
    latency: result.latency.average,
  })
})
