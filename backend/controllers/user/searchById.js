
import User from '../../model/user.js'

const SearchById = async(req ,res)=>{
   try{
      const id = req.params.id;
      if(!id){
        res.json({message : 'user id is not found'})
        return ;
      }
      const data  = await User.findById(id);
      if(data){
        console.log(data);
        return  res.status(200).json(data);
      }
      else{
        console.log('No user is find for the given Id :: ')
       return res.status(404).json({message: 'user not found'});
      }
   }
   catch(err){
      console.error('Error finding user:', err);
      res.status(500).json({ error: "Internal server error" });
   }
}

export default SearchById;



