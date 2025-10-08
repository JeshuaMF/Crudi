const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'5IV8'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static('public'))

// Create (C)
app.post('/agregarUsuario',(req,res)=>{
        let nombre=req.body.nombre
        // Note: Removed 'let id=req.body.id' as the HTML form only sends 'nombre'
        // and we rely on the DB for auto-incrementing the ID.

        con.query('INSERT INTO usuario (nombre) VALUES (?)', [nombre], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                return res.status(500).send("Error al conectar o insertar usuario");
            }
           
            // Changed the response to a simple confirmation
            return res.send(`<h1>Usuario agregado exitosamente!</h1> <p>Nombre: ${nombre}</p><a href="/">Volver</a>`);
        });
   
})

app.listen(10000,()=>{
    console.log('Servidor escuchando en el puerto 10000')
})

// Read (R)
app.get('/obtenerUsuario',(req,res)=>{
    con.query('SELECT * FROM usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);
        var userHTML=``;
        var i=0;

        respuesta.forEach(user => {
            i++;
            // Added the ID to the table for clarity and CRUD operations
            userHTML+= `<tr><td>${user.id_usuario}</td><td>${user.nombre}</td></tr>`;


        });

        return res.send(`<h2>Lista de Usuarios</h2><table>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                </tr>
                ${userHTML}
                </table>
                <br>
                <a href="/">Volver</a>`
        );


    });
});

// Delete (D)
app.post('/borrarUsuario', (req, res) => {
    const id = req.body.id; 
    
    con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send(`Usuario con ID ${id} no encontrado`);
        }
        return res.send(`<h1>Usuario borrado correctamente</h1> <p>ID: ${id}</p><a href="/">Volver</a>`);
    });
});

// Update (U) - NEW ROUTE
app.post('/actualizarUsuario', (req, res) => {
    const id = req.body.id;
    const nuevoNombre = req.body.nombre;

    con.query('UPDATE usuario SET nombre = ? WHERE id_usuario = ?', [nuevoNombre, id], (err, resultado, fields) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send(`Usuario con ID ${id} no encontrado o el nombre es el mismo`);
        }
        return res.send(`<h1>Usuario actualizado correctamente</h1> <p>ID: ${id}, Nuevo Nombre: ${nuevoNombre}</p><a href="/">Volver</a>`);
    });
});
