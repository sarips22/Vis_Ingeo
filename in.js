console.log("in.js cargado");
async function crearPersona(){

    const persona = {

        nombre:
        document.getElementById("nombre").value,

        apaterno:
        document.getElementById("apaterno").value,

        amaterno:
        document.getElementById("amaterno").value,

        email:
        document.getElementById("email").value,

        password:
        document.getElementById("password").value
    };

    const r = await fetch(
    "https://observatoriogeograficoamericalatina.org.mx/pa-api/crearPersona.php",
    {
        method:"POST",
        headers:{
            "Content-Type":
            "application/json"
        },
        body:JSON.stringify(persona)
    });

    return await r.json();

}
function siguientePaso(numero){

    document.querySelectorAll(".paso").forEach(paso=>{
        paso.classList.remove("activo");
    });

    document.getElementById("paso" + numero)
        .classList.add("activo");

    document.getElementById("tituloPaso")
        .innerText = "Paso " + numero + " de 3";

    setTimeout(()=>{
        map.invalidateSize();
    },200);
}

let latitud = null;
let longitud = null;

const map = L.map('map').setView(
    [19.29,-99.65],
    12
);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let marker;

map.on("click", function(e){

    latitud = e.latlng.lat;
    longitud = e.latlng.lng;

    if(marker){
        map.removeLayer(marker);
    }

    marker = L.marker(
        [latitud,longitud]
    ).addTo(map);

});


async function cargarEstados(){

    const r = await fetch(
    "https://observatoriogeograficoamericalatina.org.mx/mgn-api/entidades.php/get"
    );

    const estados = await r.json();

    const select =
    document.getElementById("estado");

    estados.forEach(e=>{

        select.innerHTML += `
        <option value="${e.id_ent}">
        ${e.nombre}
        </option>`;
    });

}

cargarEstados();
document.getElementById("estado").addEventListener(
"change",
async function(){

    const r = await fetch(
    `https://observatoriogeograficoamericalatina.org.mx/mgn-api/municipios.php/${this.value}`
    );

    const municipios =
    await r.json();

        const selectMunicipio =
        document.getElementById("municipio");

        selectMunicipio.innerHTML = "";

        municipios.forEach(m => {

            selectMunicipio.innerHTML += `
                <option value="${m.id_mun}">
                    ${m.nombre}
                </option>
            `;
        });

});

document.getElementById("municipio")
.addEventListener(
"change",
async function(){

    const r = await fetch(
    `https://observatoriogeograficoamericalatina.org.mx/mgn-api/localidades.php/?id_mun=${this.value}`
    );

    const localidades =
    await r.json();

    const selectLocalidad =
    document.getElementById("localidad");

    selectLocalidad.innerHTML = "";

    localidades.forEach(l => {

        selectLocalidad.innerHTML += `
            <option value="${l.id_loc}">
                ${l.nombre}
            </option>
        `;
    });

});

async function crearProblematica(idPersona){

    const problematica = {

        id_persona:idPersona,

        descripcion:
        document.getElementById("descripcion").value,

        ent:
        document.getElementById("estado").value,

        mun:
        document.getElementById("municipio").value,

        loc:
        document.getElementById("localidad").value,

        domicilio:
        document.getElementById("domicilio").value,

        geom:
        `POINT(${longitud} ${latitud})`,

        tipoPob:
        document.getElementById("tipoPob").value,

        tipoCamino:
        document.getElementById("tipoCamino").value,

        internet:
        document.getElementById("internet").value,

        pavimento:
        document.getElementById("pavimento").value
    };

    const r = await fetch(
    "https://observatoriogeograficoamericalatina.org.mx/pa-api/problematica.php",
    {
        method:"POST",
        headers:{
            "Content-Type":
            "application/json"
        },
        body:
        JSON.stringify(problematica)
    });

    return await r.json();

}

async function guardarTodo(){

    try{

        const persona =
        await crearPersona();

        console.log(persona);

        await crearProblematica(
            persona.id_persona
        );

        alert(
        "Registro exitoso"
        );

    }
    catch(error){

        console.error(error);

        alert(
        "Error al registrar"
        );

    }

}

