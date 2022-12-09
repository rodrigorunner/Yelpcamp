const  campgroundsRoutes  = require('./routes/campgroundRoutes')
const  reviewRoutes  = require('./routes/review')
const userRoutes = require('./routes/user')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const ejsMate = require('ejs-mate')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const ejs = require('ejs')
const app = express()
const flash = require('connect-flash')
const session = require('express-session')

// Passport permite conectar com várias estratégias.
const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('./models/user')

connectDB()

app.engine('ejs', ejsMate)
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        exprires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

// Serialização é como o usuário será adicionado na sessão.
passport.serializeUser(User.serializeUser())
// Deserialização é como o usuário fecha a sessão.
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found.', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if(!err.message) err.message = 'Oh no, something went wrong.'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000!')
})