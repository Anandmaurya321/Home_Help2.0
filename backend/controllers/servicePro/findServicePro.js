
import ServicePro from "../../model/servicePro.js"

const findServicePro = async (req, res) => {
    const email = req.body.email;
    const result = await ServicePro.findOne({ email: email })
    if (!result) {
        return res.send({ success: true, isEmail: false, message: "Not registered yet" })
    }
    else {
        return res.send({ success: true, isEmail: true, data: data })
    }
}

export default findServicePro



