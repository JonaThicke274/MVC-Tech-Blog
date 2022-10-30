// Allows use of express.js
const express = require(`express`);
// Allows server.js to use routes from ./routes
const routes = require(`./controllers`);
// Calls sequelize from the original declaration of sequelize in connection.js
const sequelize = require(`./config/connection.js`);
// Calls helpers to format page content when needed
const helpers = require(`./utils/helpers.js`);
// Will allow folders/files in public to be accessible to the client
const path = require(`path`);

const app = express();
const PORT = process.env.PORT || 3001;

// Allows use of handlebar for rendering webapges
const exphbs = require(`express-handlebars`);
const hbs = exphbs.create({ helpers });

app.engine(`handlebars`, hbs.engine);
app.set(`view engine`, `handlebars`);

// Allows use of sessions
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const sess = {
    secret: "MIVv*?v[b$lH75D",
    cookie: {
        // Sessions automatically expires in 15 minutes
        expires: 15 * 60 * 1000
    },
    resave: true,
    saveUninitialized: true,
    store: new SequelizeStore ({
        db: sequelize
    })
};

app.use(session(sess));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));

// Turn on routes; allows app to use routes
app.use(routes);

// Turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
});