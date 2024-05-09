const express = require('express'); // se llama a express 
const app = express();
const jwt = require('jsonwebtoken');
const keys = require('./config/keys');

app.set('key', keys.key);
app.use(express.urlencoded({ extended: false })); // Se llama a un módulo de express que codifica lo dado 
app.use(express.json());

app.post('/login', (req, res) => {
    if (req.body.user == 'admin' && req.body.pass == 'asdf123!') {
        const payload = {
            check: true
        };
        const token = jwt.sign(payload, app.get('key'), {
            expiresIn: '3d'
        })
        res.json({ msg: "Se encuentra logueado correctamente", token: token });

    } else {
        res.json({ msg: "Usuario y/o contraseña incorrectos" });
    }
});


// Tipo de acceso - tipo de verificación 
const verification = express.Router();

verification.use((req, res, next) => {
    let token = req.headers['access-token'] || req.headers['authorization'];
    // console.log(token);

    if (!token) {
        res.status(401).send({ msg: "Token no válidado, puede estar sin token" });
        return
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        console.log(token);
    }
    if (token) {
        jwt.verify(token, app.get('key'), (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: "El token es incorrecto" });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
});







app.get('/info', verification, (req, res) => {
    res.send("Token validado exitosamente");
})


// configuración del puerto del servidor 
app.listen(5000, () => {
    console.log('El servidor está conectado http://localhost:5000');
})

// Configuración de rutas 
app.get('/', (req, res) => {
    res.send('Hola, mundo');
})

