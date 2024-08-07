import Joi from 'joi';

const UserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required() 
});

export const validateINPUT = (req, res, next) => {
    const { error } = UserSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    next();
};