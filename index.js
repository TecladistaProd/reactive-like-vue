import Frame from './Frame.js'

let app = new Frame({
	el: '#app',
	data: {
		name: 'John Doe'
	},
	mounted(){
		this.name = localStorage.getItem('name')
	},
	methods: {
		mudaVal(){
			localStorage.setItem('name', this.name)
		}
	}
})

window.app = app

// console.log(app)