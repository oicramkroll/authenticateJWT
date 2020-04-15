const {celebrate,Segments,Joi} = require('celebrate');
const routes = require('express').Router();
const controller = {
    authenticate: require('./controller/authenticate'),
    private: require('./controller/private'),
    public: require('./controller/public')
};
const auth = require('./middlewares/auth');

routes.post('/auth/register',controller.authenticate.register);
routes.post('/auth/authenticate',controller.authenticate.login);
routes.post('/auth/forgotpassword',controller.authenticate.forgotPassword);
routes.post('/auth/resetpassword',controller.authenticate.resetPassword);

routes.get('/private/home',celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),auth,controller.private.home);
routes.get('/home',controller.public.home);



module.exports = routes;