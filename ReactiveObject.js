function Seer (dataObj) {
	let signals = {}
	
	observeData(dataObj)

	// Besides the reactive data object, we also want to return and thus expose the observe and notify functions.

	dataObj.observe = observe

	dataObj.notify = notify

	return dataObj

	function observe (property, signalHandler) {
		if(!signals[property]) signals[property] = []

		signals[property].push(signalHandler)	
	}

	function notify (signal) {
		if(!signals[signal] || signals[signal].length < 1) return

		signals[signal].forEach((signalHandler) => signalHandler())
	}

	function makeReactive (obj, key) {
		let val = obj[key]

		Object.defineProperty(obj, key, {
			get () {
				return val
			},
			set (newVal) {
				console.log(newVal)
				val = newVal
				notify(key)
			}
		})
	}

	function observeData (obj) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				makeReactive(obj, key)
			}
		}
	}
}

export default Seer