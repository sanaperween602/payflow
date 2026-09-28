const express = require ("express");
const router = express.Router();
const zod = require("zod");
const { User , Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {authMiddleware} = require("../middleware");
//for signup
const signupBody = zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()

});

router.post("/signup",async function(req,res){
    const{success} =signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"email already taken "
        });
    }
    const existingUser=await User.findOne({
        username:req.body.username
    });
    if(existingUser){
        return res.status(411).json({
            message:"email already taken"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    });
    const userId = user._id;
    //create new account---

    await Account.create({
        userId,
        balance: 1+ Math.random()*10000
    })
    const token = jwt.sign({
        userId : user._id
    },JWT_SECRET);

    res.json({
        message:"User create successfully",
        token: token
    });
});
//for signin
const signinBody = zod.object({
    username:zod.string().email(),
    password:zod.string()
});
router.post("/signin",async function(req,res){
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect inputs"
        });
    }
    const user = await User.findOne({
        username:req.body.username,
        password:req.body.password
    });
     if(user){
        const token = jwt.sign({
            userId:user._id
        },JWT_SECRET);
  
     return res.json({
        token: token
    });
};
res.status(411).json({
    message:"Error while logging in"
});
});
//updating 
const updateBody = zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
});
router.put("/",authMiddleware,async function(req,res){
    const {success} = updateBody.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message:"Error while updating information"
        });
    }
    await User.updateOne
    (
        {_id:req.userId},
        req.body
    );
    res.json({
        message:"Updated succefully"
    })
});
//search user
router.get("/bulk", async function(req,res){
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [
            {
                firstName :{
                    "$regex":filter
                }
            },
            {
                lastName :{
                    "$regex": filter
                }
            }
        ]
    });
    res.json({
        users:users.map(function(user){
            return {
                username: user.username,
                firstName:user.firstName,
                lastName:user.lastName,
                _id:user._id
            };
        })
    });
});
module.exports = router;