import connect from '@vkontakte/vkui-connect'

const methods = {}
let req_counter = 0

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
		if (methods[event.data.request_i] !== undefined) {
			methods[event.data.request_id].r(event)
			methods[event.data.request_id] = undefined
		}
	}
}

export default {
	getToken,
	call,
	api,
	resolver,
}
