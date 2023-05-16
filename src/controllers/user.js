const fs = require("fs")
const bcrypt = require("bcryptjs")
const { decodeBase64Image } = require('../utils')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
  
class UserController {

   static updateUser = async (req) => {
        try {
            const body = req.rawInput;
            const { email, password,profileImage, ...rest } = body;
            let userUpdate = {
                ...rest,
                email: body.email.toLowerCase(),
            };
        
            if( body.password ){
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hash = await bcrypt.hash(body.password, salt);
                userUpdate.password = hash
            }
            
            if( body.profileImage ){
                var imageBuffer = decodeBase64Image(body.profileImage);
                const imagePath = new Date().toISOString().replace(/:/g, "-") + "-"+'profile.jpg'
                fs.writeFile("./uploads/" + imagePath, imageBuffer.data, function(err) { });
                userUpdate.profileImage = imagePath;
            }
            const upsertUser = await prisma.user.upsert({
                where: { email: email.toLowerCase() },
                update: userUpdate,
                create: userUpdate
            });

            return {
                message: 'User updated Successfully.',
                data: upsertUser
            }
        } catch (err) {
            console.log(err);
            return{
                message: "Internal Server Error",
                data: null
            };
        }
    };
}

module.exports = UserController;
