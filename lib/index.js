const soap = require('soap')
const path = require('path')
const extend = require('extend')

let FedExAPI = function (args) {
	this.authData = {
		key: args.key,
		password: args.password,
		accountNumber: args.accountNumber,
		meterNumber: args.meterNumber,
	}

	this.hosts = {
		sandbox: 'https://wsbeta.fedex.com',
    	live: 'https://ws.fedex.com',
	}

	this.settings = {
		imperial: args.imperial || true, // for inches/lbs, false for metric cm/kgs
		currency: args.currency || 'USD',
		language: args.language || 'en-US',
		environment: args.environment || 'sandbox',
	}
}

function generateBody (data, auth, resource) {
	const authData = {
		WebAuthenticationDetail: {
			UserCredential: {
				Key: auth.key,
				Password: auth.password
			}
		},
		ClientDetail: {
			AccountNumber: auth.accountNumber,
			MeterNumber: auth.meterNumber,
			IntegratorId: '12345',
			Localization: {
				LanguageCode: 'EN',
				LocaleCode: 'ES'
			}
		}
	}

	if(resource) {
		authData['Version'] = {
		  ServiceId: resource.ServiceId,
		  Major: resource.Major,
		  Intermediate: resource.Intermediate,
		  Minor: resource.Minor
		}
	}

	return extend(authData, data)
}

FedExAPI.prototype.createShipment = async function (data) {
	try {
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'ShipService_v23.wsdl'), {endpoint: this.hosts[this.settings.environment] + '/web-services'})

		let resources = {
			ServiceId: 'ship',
			Major: 23,
			Intermediate: 0,
			Minor: 0
		}

		if (!client) {
			throw new Error({
				code: 404,
				message: 'Something went wrong'
			})
		}

		let params = generateBody(data, this.authData, resources)

		let response = await client.processShipmentAsync(params)

		return response
	} catch (err) {
		throw err
	}
}

FedExAPI.prototype.deleteShipment = async function (data) {
	try {
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'ShipService_v23.wsdl'), {endpoint: this.hosts[this.settings.environment] + '/web-services'})

		let resources = {
			ServiceId: 'ship',
			Major: 23,
			Intermediate: 0,
			Minor: 0
		}

		if (!client) {
			throw new Error({
				code: 404,
				message: 'Something went wrong'
			})
		}

		let params = generateBody(data, this.authData, resources)

		let response = await client.deleteShipmentAsync(params)

		return response
	} catch (err) {
		throw err
	}
}

FedExAPI.prototype.createPickup = async function (data) {
	try {
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'PickupService_v17.wsdl'), {endpoint: this.hosts[this.settings.environment] + '/web-services'})

		let resources = {
			ServiceId: 'disp',
			Major: 17,
			Intermediate: 0,
			Minor: 0
		}

		if (!client) {
			throw new Error({
				code: 404,
				message: 'Something went wrong'
			})
		}

		let params = generateBody(data, this.authData, resources)

		let response = await client.createPickupAsync(params)

		return response
	} catch (err) {
		throw err
	}
}

FedExAPI.prototype.checkPickupAvailability = async function (data) {
	try {
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'PickupService_v17.wsdl'), {endpoint: this.hosts[this.settings.environment] + '/web-services'})

		let resources = {
			ServiceId: 'disp',
			Major: 17,
			Intermediate: 0,
			Minor: 0
		}

		if (!client) {
			throw new Error({
				code: 404,
				message: 'Something went wrong'
			})
		}

		let params = generateBody(data, this.authData, resources)
	
		let response = await client.getPickupAvailabilityAsync(params)

		return response
	} catch (err) {
		throw err
	}
}

FedExAPI.prototype.cancelPickup = async function (data) {
	try {
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'PickupService_v17.wsdl'), {endpoint: this.hosts[this.settings.environment] + '/web-services'})

		let resources = {
			ServiceId: 'disp',
			Major: 17,
			Intermediate: 0,
			Minor: 0
		}

		if (!client) {
			throw new Error({
				code: 404,
				message: 'Something went wrong'
			})
		}

		let params = generateBody(data, this.authData, resources)
	
		let response = await client.cancelPickupAsync(params)

		return response
	} catch (err) {
		throw err
	}
}

FedExAPI.prototype.requestTrackingInfo = async function (data) {
	try {
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'TrackService_v16.wsdl'), {endpoint: this.hosts[this.settings.environment] + '/web-services'})

		let resources = {
			ServiceId: 'trck',
			Major: 16,
			Intermediate: 0,
			Minor: 0
		}

		if (!client) {
			throw new Error({
				code: 404,
				message: 'Something went wrong'
			})
		}

		let params = generateBody(data, this.authData, resources)
	
		let response = await client.trackAsync(params)

		return response
	} catch (err) {
		throw err
	}
}

FedExAPI.prototype.rates = async function (data) {
	try {
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'RateService_v24.wsdl'), {endpoint: this.hosts[this.settings.environment] + '/web-services'})

		let resources = {
			ServiceId: 'crs',
			Major: 24,
			Intermediate: 0,
			Minor: 0
		}

		if (!client) {
			throw new Error({
				code: 404,
				message: 'Something went wrong'
			})
		}

		let params = generateBody(data, this.authData, resources)
	
		let response = await client.getRatesAsync(params)

		return response
	} catch (err) {
		throw err
	}
}

module.exports = FedExAPI