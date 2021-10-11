var mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

var loginmodel = mongoose.Schema({
    email : {
        type : String,
        required: [true,'Please enter an email'],
        unique : true,
        lowercase : true,
        validate : [isEmail,'Please  enter valid email']
        
    },
    pass : {
        type : String,
        required: [true,'Please enter a password'],
        minlength : [4,'Minimum password length is 4']
    }
});


//fire a  before function
loginmodel.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.pass = await bcrypt.hash(this.pass,salt);
    next();
})

// static method to login user
loginmodel.statics.login = async function(email,pass){
    const nuser = await this.findOne({email})
    if(nuser){
        const auth = await bcrypt.compare(pass,nuser.pass)
        if(auth){
            return nuser;
        }
        throw Error("Incorrect Password")
    }
    throw Error('Incorrect Email')
}

module.exports = mongoose.model("logins",loginmodel)