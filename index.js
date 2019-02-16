import connect from '@vkontakte/vkui-connect'

let access_token = null
let v = '5.92'
const methods = {}
let req_counter = 0

const execute_promise = {}
const execute_methods = []
let execute_counter = 0

const getToken = (app_id, scope) => {
	if (typeof scope !== 'string') scope = scope.join(',')
	return new Promise(r => {
		let handler = e => {
			const event = e.detail
			r(event)
			connect.unsubscribe(handler)
		}
		connect.subscribe(handler)
		connect.send('VKWebAppGetAuthToken', { app_id, scope })
	})
}

const call = (method_name, params) => {
	const promise_name = `method${req_counter++}`
	connect.send(method_name, {
		request_id: promise_name,
		...params,
	})
	return new Promise(r => {
		methods[promise_name] = {
			r,
		}
	})
}

const api = async (method_name, params) => {
	return await call('VKWebAppCallAPIMethod', {
		method: method_name,
		params,
	})
}

const resolver = e => {
	const event = e.detail
	if (event.data.request_id !== undefined) {
		if (methods[event.data.request_id] !== undefined) {
			methods[event.data.request_id].r(event)
			methods[event.data.request_id] = undefined // unlink for prevent memory leak
		}
	}
}

const execute = (method_name, params) => {
	const id = `method${execute_counter++}`
	return new Promise(r => {
		execute_methods.push({
			id,
			name: method_name,
			params,
		})
		execute_promise[id] = {
			r,
		}
	})
}

const executor = async () => {
	const executingMethods = []
	for (let i = 0; i < 25; i++) {
		if (execute_methods.length > 0) executingMethods.push(execute_methods.shift())
	}
	if (executingMethods.length === 0) return

	let codeStrings = executingMethods.map(
		method => `\"${method.id}\": API.${method.name}(${JSON.stringify(method.params)})`
	)

	let {
		data: { response, execute_errors, error },
	} = await api('execute', {
		access_token,
		v,
		code: `return { ${codeStrings.join(',\n')} };`,
	})

	Object.entries(response).forEach(element => {
		if (element[1] !== false) {
			execute_promise[element[0]].r(element[1])
			execute_promise[element[0]] = undefined // unlink for prevent memory leak
		}
	})

	Object.entries(response)
		.filter(e => e[1] === false)
		.map((e, i) => {
			execute_promise[e[0]].r(execute_errors[i])
			execute_promise[e[0]] = undefined
		})
}

const updateToken = new_token => (access_token = new_token)

setInterval(executor, 350)

export default {
	getToken,
	call,
	api,
	resolver,
	execute,
	updateToken,
}
