
import '../../config/db.js' // importing connections ::: >>>>>

import ServicePro from '../../model/servicePro.js'

const ValidateServicePro = async(req , res)=>{
    console.log('Validating service request')
    console.log(req.body)
    const servicepro = new ServicePro(req.body.providerData)
    let result = await servicepro.save()
    result = await result.toJSON()
    console.log(result)
    res.send(result)
}

export default ValidateServicePro;

