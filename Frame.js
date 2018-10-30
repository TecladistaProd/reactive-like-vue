import { $ } from './ModuleJ.js'
import CustomError from './CustomError.js'

window.vzs = 0

function criarFram(obj){

	$('[v-cloak]').removeAttribute('v-cloak')

	let signals = {}

	this.observe = observe

	this.notify = notify

	for(let key in obj.data){
		Object.defineProperty(this, key, {
			get() {
				return obj.data[key]
			}, 
			set(newVal) {
				obj.data[key] = newVal
				notify(key)
			}
		})

		if(!!!key.match(/(observe|notify)/gi)){
			this.observe(key, ()=> domR.call(this))
		}
	}
	
	for(let k in obj.methods){
		this[k] = obj.methods[k]
	}

	this.el = obj.el
	
	let that = this

	function domR() {
		const { el } = this
		let callB = []
		for(let tag of $(el).children){
			if(tag.nodeName !== 'SCRIPT'){
				
				let com = tag.innerHTML.indexOf('{{')
				let fim = tag.innerHTML.indexOf('}}')

				if(!!tag.func || (com >= 0 && fim >=0)){
					if(!!!tag.original){
						tag.func = tag.innerHTML.slice(com+2, fim)
						tag.original = tag.innerHTML
						tag.rep = `{{${tag.func}}}`
					}
					let {original} = tag
					
					original = original.replace(tag.rep, this[tag.func] || eval(tag.func) )

					if(tag.innerHTML !== original)
						tag.innerHTML = original
				}
			}

			if(tag.attributes.length > 0){
				let callFn = {}
				for(let att in tag.attributes){
					let name = tag.attributes[att].name || ''

					if(name.match('@') && vzs < 1){
						callB.push(()=> tag.removeAttribute(name))
						let val = this[tag.attributes[att].value]	
						val = val.bind(that)
						!!callFn[name.replace('@', '')] && !!callFn[name.replace('@', '')].length
							? callFn[name.replace('@', '')].push(val || eval(tag.attributes[att].value) ) 
							: callFn[name.replace('@', '')] = [val || eval(tag.attributes[att].value)]
					}

					if(name.match(':')){
						callB.push(()=> tag.removeAttribute(name))
						let v = tag.attributes[att].value
						let val = this[v]

						!!callFn['keyup'] && !!callFn['keyup'].length
							? callFn['keyup'].push(({target})=> {
								if(this[v] == target.value){
									return
								} else {
									this[v] = target.value
								}
							})
							: callFn['keyup'] = [({target})=> {
								if(this[v] == target.value){
									return
								} else {
									this[v] = target.value
								}
							}]
						if(!!val || val === ''){
							tag[name.replace(':', '')] = (val)
						} else if(!! eval(tag.attributes[att].value)){
							tag[name.replace(':', '')] = eval(tag.attributes[att].value)
						} else {
							throw new CustomError( 'Undefined Value:', tag.attributes[att].value )
						}
					}
				}
				for(let cFn in callFn){
					tag.addEventListener(cFn, (e)=> callFn[cFn].forEach(i=> i.call(this, e)))
				}
				vzs++
			}
		}
		callB.forEach(it=> {
			it.call(null)
		})
	}

	obj.mounted.call(this)
	domR.call(this)

	function observe (property, signalHandler) {
		if(!signals[property]) signals[property] = []

		signals[property].push(signalHandler)	
	}

	function notify (signal) {
		if(!signals[signal] || signals[signal].length < 1) return

		signals[signal].forEach((signalHandler) => signalHandler())
	}
}

export default class Frame extends criarFram{
	constructor(obj){
		super(obj)
	}
}