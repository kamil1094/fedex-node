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

	this.defaults = {
		imperial: true, // for inches/lbs, false for metric cm/kgs
		currency: 'USD',
		language: 'en-US',
		environment: 'sandbox',
	}
}

//change that function name because its also merging shipment data etc. Not only auth data
function generateAuth (data, auth, resource) {
	const authData = {
		WebAuthenticationDetail: {
			UserCredential: {
				Key: auth.key,
				Password: auth.password
			}
		},
		ClientDetail: {
			AccountNumber: auth.accountNumber,
			MeterNumber: auth.meterNumber
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

FedExAPI.prototype.shipment = async function (data) {
	try {
		// soap.createClient() -> in other words just build soap request
		let client = await soap.createClientAsync(path.join(__dirname,  'wsdl', 'ShipService_v23.wsdl'), {endpoint: this.hosts['sandbox'] + '/web-services'})

		let resource = {
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

		let params = generateAuth(data, this.authData, resource)
		//console.log(client)

		let response = await client.processShipmentAsync(params)

		return response

		// from response get client and use generateAuth function with that client to getRates

		// return rates

	} catch (err) {
		throw err
	}
}

FedExAPI.prototype.rates = async function () {
	// soap.createClient() -> in other words just build soap request

	// from response get client and use generateAuth function with that client to getRates

	// return rates

}

module.exports = FedExAPI