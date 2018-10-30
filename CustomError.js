class CustomError extends Error {
	constructor(name, message){
		super(name, message)
		this.name = name || 'Unamed Error'
		this.message = message
	}
}

export default CustomError