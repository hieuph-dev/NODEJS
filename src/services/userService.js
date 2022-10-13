import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
      try {
        var hashPassword = await bcrypt.hashSync(password, salt);
        resolve(hashPassword);
      } catch (e) {
        reject(e);
      }
    });
  };

let handleUserLogin = (email, password) => {
    return new Promise( async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'], 
                    where: {email : email},
                    raw: true
                });

                if (user)  {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }

                }else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }

            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exsist in your system. Plz try other email!`;
            }

            resolve(userData);
        } catch (e) {
            reject(e)
        }
    })
   
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail}
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } 
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)

        } catch (e) {
            reject(e);
        } 
    })
}

let createNewUser = (data) => {
    return new Promise( async(resolve, reject) => {
        try {
            //check emmail is exist ??
            let check = await checkUserEmail(data.email);
            if(check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used, Plz try another email'
                })
            }else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                  email: data.email,
                  password: hashPasswordFromBcrypt,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  address: data.address,
                  phoneNumber: data.phoneNumber,
                  gender: data.gender === "1" ? true : false,
                  roleId: data.roleId,
                });
          
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }
            
        } catch(e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId}
        })
        if(!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }

        await db.User.destroy({
            where: {id: userId}
        })
        resolve({
            errCode: 0,
            message: `The user deleted`
        })
    })
}


let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
              });
              if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save()
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                // }, {where: {id: userId}})
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                })
              } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                });
              }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,

}