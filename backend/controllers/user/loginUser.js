
import User from "../../model/user.js" 
import bcrypt from 'bcrypt'
import Token from '../../utils/token.js'


const Login = async (req, res) => {
    try {
        const { email, password: rec_pass } = req.body;  // taking recived password :: >

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Async password comparison
        const passwordMatch = await bcrypt.compare(rec_pass, user.password);

        if (!passwordMatch) {
            return res.json({ success: false, message: "Wrong password" });
        }

        
        const payload = {
            id: user._id,
            role: user.role
        };

        
        const token = Token(payload);

        if(token===null){
           return res.json({message:"jwt error"})
        }


        // Sab sahi hone par response bheja
        return res.json({
            name: user.name,
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



