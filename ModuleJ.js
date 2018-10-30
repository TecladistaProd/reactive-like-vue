export const $ = el => {
	let ret = document.querySelectorAll(el)
	if(ret.length > 1)
		return ret
	else
		return ret[0]
}