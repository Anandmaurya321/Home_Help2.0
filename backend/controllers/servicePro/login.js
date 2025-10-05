


import ServicePro from '../../model/servicePro.js' // importing model
import bcrypt from 'bcrypt'
import Token from '../../utils/token.js';



const Login = async (req, res) => {
    try {
        const { email, password: rec_pass } = req.body; // email and recived password :: >>

        const servicePro = await ServicePro.findOne({ email: email });

        if (!servicePro) {
            return res.status(404).json({ success: false, message: "servicePro not found" });
        }

        // 2. Async password comparison
        const passwordMatch = await bcrypt.compare(rec_pass, servicePro.password);

        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Wrong password" });
        }

        // 3. Secure aur minimal payload banaya :: >>>
        const payload = {
            id: servicePro._id,
            role: servicePro.role
        };
       
        // data matched now you need to give access by providing token to access>>>>>


        const token = Token(payload);
        
        if(token===null){
            return res.json({message : "jwt error"})
        }
        
        // Sab sahi hone par response bheja
        return res.json({
            name: servicePro.name,
            success: true,
            message: "You are logged in now",
            auth: token
        });

    } 
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export default Login;




