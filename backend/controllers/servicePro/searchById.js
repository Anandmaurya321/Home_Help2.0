
import ServicePro from '../../model/servicePro.js'

const FindById = async(req , res)=>{
    const id = req.params.id;
    if(!id){
        console.log("Id is not present");
        res.json({message: "Id is not present"})
        return ;
    }
    
    const result = await ServicePro.findById(id);
    if(!result){
        console.status(404).json({message:"ServicePro is not found"})
        return;
    }
    console.log("Result is send successfully:::")
    res.status(200).json(result);
}

export default FindById
