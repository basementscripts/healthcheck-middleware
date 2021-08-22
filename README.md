# healthcheck-middleware

![Coverage](./badge.svg)

Node.js Express Middleware for healthcheck

A heathcheck can be a valuable tool in the arsenal of disaster recovery and overall performance. A typical healthcheck is a simple `"Ok"` response from a `REST` endpoint.

Todays infrastructure, microservices or applications (e.g. Lerna) exsisting of a bundle of microservices, provide a challenge to proper monitoring of services. With that being said, a simple `"Ok"` means nothing other that the app is standing with a reachable point. In an express app, that is not difficult to achieve.

Well what if you wanted to know the status of a service connection like a Message Queue Broker. Yes you can have a dashboard letting you know on the Broker side what the status of the service is. What if we wanted to have more granular status form an implementing service. How about add a service status to a secured healthcheck? Sounds good to me.

> The `POST` verb should be properly secured behind authentication. <br>Exposing internal configurations to external unsecured audiences can lead to potential security issues. <br>**`Don't Do It`**

We've provided a simple `ping` to handle generic `GET` request to the healthcheck

## usage

### Ping

```bash
$ curl http://localhost:3001/health
```

response

```bash
Ok
```

### Healthcheck Verbose

```bash
$ curl -X POST http://localhost:3001/health
```

response

```bash
{
	"appName": "API",
	"timestamp": "2020-11-20T23:46:49.251Z",
	"server": 12000,
	"region": "us-east-1",
	"services": [
		{
			"id": "56969530-87f2-4a27-a297-12e4c90b04e9",
			"name": "broker",
			"timestamp": "2020-11-20T23:46:49.252Z",
			"startTime": "2020-11-20T23:46:47.371Z",
			"upTime": "1881",
			"status": "Ok",
			"data": {
				"host": "e-2f0c9slkj-2sj-b4e1-f3b7564asdf3998.mq.us-east-1.amazonaws.com",
				"cluster_name": "broker",
				"platform": "Erlang/OTP 23.0.3",
				"product": "RabbitMQ",
				"version": "3.8.6"
			}
		}
	]
}
```

This tool has become a vital tool for us, we've decided to share it with you.

## Typescript

```ts
import { express } from 'express'
import { createServer } from 'http'
import { healthcheck } from '@basementscripts/healthcheck-middleware'

const app = express()

// apply middleware
app.use(
	healthcheck({
		pid: process.pid,
		appName: 'api',
		region: 'us-east-1'
	})
)
const server = createServer(app)
```

add a service agent to the healthcheck

```ts
import { registerStatusAgent } from '@basementscripts/healthcheck-middleware'
import amqp, { Connection } from 'amqplib'

export interface BrokerConnectionOptions {
	name?: string
	host: string
}

export const connect = async ({
	name = 'broker',
	host
}: BrokerConnectionOptions): Promise<void> => {
	const agent = registerStatusAgent({
		name,
		data: {
			host
		}
	})

	try {
		const { connection }: Connection = await amqp.connect(host)
		agent.up(connection.serverProperties)
	} catch (e) {
		agent.down(e)
	}
}
```

example health check output

```json
{
	"appName": "API",
	"timestamp": "2020-11-20T23:46:49.251Z",
	"server": 12000,
	"region": "us-east-1",
	"services": [
		{
			"id": "56969530-87f2-4a27-a297-12e4c90b04e9",
			"name": "broker",
			"timestamp": "2020-11-20T23:46:49.252Z",
			"startTime": "2020-11-20T23:46:47.371Z",
			"upTime": "1881",
			"status": "Ok",
			"data": {
				"host": "e-2f0c9slkj-2sj-b4e1-f3b7564asdf3998.mq.us-east-1.amazonaws.com",
				"cluster_name": "broker",
				"platform": "Erlang/OTP 23.0.3",
				"product": "RabbitMQ",
				"version": "3.8.6"
			}
		}
	]
}
```
