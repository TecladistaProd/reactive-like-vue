import ReactiveObj from './ReactiveObject.js'
import { $ } from './ModuleJ.js'

window.$ = $

let data = new ReactiveObj({
	name: 'John Doe',
	age: 25
})

function mudaVal({target}) {
	data.name = target.value
}

data.observe('name', () => {
	domR()
})

data.observe('age', () => domR())

window.vzs = 0

function domR(){
	let callB = []

	for(let tag of $('#app').children){
		if(tag.nodeName !== 'SCRIPT'){
			
			let com = tag.innerHTML.indexOf('{{')
			let fim = tag.innerHTML.indexOf('}}')
			if(!!tag.func || (com >= 0 && fim >=0)){
				let x = tag.innerHTML.slice(com+2, fim)
				let rep = `{{${x}}}`
				if(!!!tag.val){
					tag.func = x
					tag.val = eval(x)
				} else {
					rep = tag.val
					tag.val = eval(tag.func) || '&nbsp;'
				}
				tag.innerHTML = tag.innerHTML.replace(rep, tag.val)
			}
		}

		if(tag.attributes.length > 0 && vzs < 1){
			vzs++
			for(let att in tag.attributes){
				let name = tag.attributes[att].name || ''

				if(name.match('@')){
					callB.push(()=> tag.removeAttribute(name))
					tag.addEventListener(name.replace('@', ''), eval(tag.attributes[att].value))
				}

				if(name.match(':')){
					callB.push(()=> tag.removeAttribute(name))
					tag[name.replace(':', '')] = eval(tag.attributes[att].value)
				}
			}
		}
		callB.forEach(it=> {
			it.call(null)
		})
	}
}

domR()