



import '../../config/db.js'       // impoting connection ::

import ServicePro  from '../../model/servicePro.js'        // importing model

const AllServicePro = async (req, res) => {
    const result = await ServicePro.find() // find all and send::::>>
    res.send(result)
}


export default  AllServicePro;

