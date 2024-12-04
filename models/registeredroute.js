const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registeredRouteSchema = new Schema({
    route_id: {
    type: Schema.Types.ObjectId,
    ref: 'Route', // Reference to the Route model
    default: null,

    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        default: null,
    },
    stop_name: {
        type: String,
        default: null,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
const RegisteredRoute = mongoose.model('RegisteredRoute', registeredRouteSchema);
module.exports = RegisteredRoute;