

import '../../config/db.js'
import ServiceRequests from '../../model/serviceRequests.js'

const SearchService = async (req, res) => {
   const result = await ServiceRequests.find()
   res.send(result) 
}

export default SearchService;





