const Auth_Model = require("../Model/Admin")
const User_Model = require("../Model/userInfo")
const { setAdmin } = require("../Utils/jwt")


async function handleGetUser(req, res) {

    try {

        const getUser = await User_Model.find({})
        
        res.status(200).json({status: true, data: getUser})
        
    } catch (error) {
        console.log("Something is error")
        res.status(500).json({status: false, message: "internal server error"})
    }

}




async function handleAdminLogin(req, res) {


        const {email, password} = req.body


               try {

                const checkAdmin = await Auth_Model.findOne({adminId: email})

                if(!checkAdmin){
                    return res.status(404)
                              .json({ message: "Invalid User Details", 
                                      status: false});
                }

                

                if(checkAdmin.password != password){
                     return res.status(400)
                               .json({ message: "Incorrect Password", 
                                       status: false});
                }


                const jwtToken = setAdmin(checkAdmin)

                res.cookie('token', jwtToken, { 
                              httpOnly: true, 
                              secure: true, 
                              sameSite: 'None', 
                              path: '/' }
                          );





        res.status(200)
           .json({message: "Login Successful",
                  status: true,
                  token: jwtToken,
                  user: checkAdmin.adminId})


                
               } catch (error) {
                console.log(error)
               }

}



async function handleGetUserPass(req, res){

    const {email, phone} = req.body;

    try {

        const findUser = await User_Model.findOne({ 
                                                  user_email: email, 
                                                  user_number: phone
                                                })


        res.status(200).json({status: true, formData: findUser})
        
    } catch (error) {
        res.status(500).json({status: false, message: 'Something is error.....'})
    }

}




module.exports = {
    handleGetUser,
    handleAdminLogin,
    handleGetUserPass,
}