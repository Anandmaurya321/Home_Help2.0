

const HomePage = (req , res)=>{
    console.log('req is recived :: ')
    res.send('api call is working' , req.body)
}
export default HomePage



