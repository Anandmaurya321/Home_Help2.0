

import '../../config/db.js'

import ServicePro from '../../model/servicePro.js'

const SearchServicePro = async (req, res) => {
    const key = req.params.key;
    const result = await ServicePro.find({
        '$or': [
            { name: { $regex: key, $options: 'i' } },
            { service: { $regex: key, $options: 'i' } },
            { address: { $regex: key, $options: 'i' } }
        ]
    })
    res.send(result)
}


export default SearchServicePro;

