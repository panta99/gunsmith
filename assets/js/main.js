let meni = [];
let proizvodi = [];
//AJAX zahtev
function dohvatiPodatke(file, callback){
    $.ajax({
        url: "/gunsmith/assets/data/" + file + ".json",
        method: "get",
        dataType: "json",
        success: function(response){
            callback(response);
        },
        error: function(err){
            console.log(err);
            alert("Error, try again later");
        }
    });
}
    //Funkcija za dohvatanje podataka iz local storage
function getItemLS(ime){
        return JSON.parse(localStorage.getItem(ime));
    }
    //Funkcija za setovanje podataka u local storage
function setItemLS(ime,vrednost){
        localStorage.setItem(ime,JSON.stringify(vrednost));
    }
function promeniBrojacArtikala(){
        if(localStorage.getItem("brojArtikala")==null || localStorage.getItem("brojArtikala")==""){
            localStorage.setItem("brojArtikala",1);
        }
        else{
            let brojac = parseInt(localStorage.getItem("brojArtikala"));
            brojac++;
            console.log(brojac);
            localStorage.setItem("brojArtikala",brojac);
        }
}
function umanjiBrojacArtikala(){
    let brojac = parseInt(localStorage.getItem("brojArtikala"));
    brojac--;
    localStorage.setItem("brojArtikala",brojac);
}
window.onload = ()=>{
    dohvatiPodatke("menu",skladistiMeni);
    dohvatiPodatke("products",skladistiProizvode);
//Skladistenje menija u local storage
function skladistiMeni(data){
    localStorage.setItem("meni",JSON.stringify(data));
}
//Skladistenje proizvoda u local storage
function skladistiProizvode(data){
    localStorage.setItem("proizvodi",JSON.stringify(data));
}
ukloniPreloader();
function ukloniPreloader(){
    $("#preloader").addClass("ukloniPreloader");
}
}
$(document).ready(function(){
//Ispisivanje menija
dohvatiPodatke("menu",ispisiNav);
let kategorije = [];
let brendovi = [];
let url = window.location.pathname;
meni = JSON.parse(localStorage.getItem("meni"));
proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
//Ispis menija
function ispisiNav(nav){
    let brojacArtikala = parseInt(localStorage.getItem("brojArtikala"));
    let html=`<ul class="navbar-nav ms-auto">`;
        for(n of nav){
            if(url == `/gunsmith/${n.href}`){
                if(n.text=="Cart"){
                    html+=`<li class="nav-item text-center"><a class="nav-link active-link" href="${n.href}">${n.text}<i class="fa-solid fa-cart-shopping"><span id="brojArtikala"></span></i></li>`
                    continue;
                }
                html+=`<li class="nav-item text-center"><a class="nav-link active-link" href="${n.href}">${n.text}</a></li>`;
                continue;
            }
            if(n.text=="Cart"){
                html+=`<li class="nav-item text-center"><a class="nav-link bela" href="${n.href}">${n.text}<i class="fa-solid fa-cart-shopping"><span id="brojArtikala"></span></i></li>`
            }
            else{
            html+=`<li class="nav-item text-center"><a class="nav-link bela" href="${n.href}">${n.text}</a></li>`;
        }
        }
        html+=`</ul>`;
    $("#navbarResponsive").html(html);
    brojArtikala = document.querySelector("#brojArtikala");
    $(brojArtikala).html(brojacArtikala);
    }
//Promena logoa na hover
$("#logo").hover(promeniLogo,vratiLogo);
function promeniLogo(){
    $("#slikakodLogoa").attr("src","assets/img/logoGun1.png");
}
function vratiLogo(){
    $("#slikakodLogoa").attr("src","assets/img/logoGun.png");
}

//Uzimanje linka stranice
console.log(url);
function ukloni(){
    $("#preloader").remove();
}
//Home JS
if(url=="/gunsmith/" || url=="/gunsmith/index.html"){
    setTimeout(pojavljivanjeTeksa,800);
    function pojavljivanjeTeksa(){
        let opacity1 = 1;
        $("#welcomep").animate({
            "opacity":opacity1
        });
        $("#shopnow").animate({
            "opacity":opacity1
        });
        ukloni();
    }
    //Hover efekat na shop now
    $("#shopnowlink").hover(promeniBoju,vratiBoju);
    function promeniBoju(){
        $("#shopnow").addClass("prekoLinka");
        $("#shopnow span").addClass("bela");
    }
    function vratiBoju(){
        $("#shopnow").removeClass("prekoLinka");
        $("#shopnow span").removeClass("bela");
    }
}
//Products JS
if(url=="/gunsmith/products.html"){
    setTimeout(ukloni,800);
    dohvatiPodatke("products",prikaziProizvode);
    //Prikazivanje kategorija
    dohvatiPodatke("categories",prikaziKategorije);
    function prikaziKategorije(data){
        let html="";
        data.forEach(k=>{
            html+=`<li class="list-group-item">
                        <input type="checkbox" value="${k.id}" class="kategorija" name="kategorija"/><span class="mx-2">${k.name}</span>
                    </li>`
        });
        $("#categories").html(html);
        kategorije = data;
        $(".kategorija").change(filterChange);
        dohvatiPodatke("brands",prikaziBrendove);
    }
    //Ispisivanje brendova
    function prikaziBrendove(data){
        let html = "";
        data.forEach(b=>{
            html+=`<li class="list-group-item">
                        <input type="checkbox" value="${b.id}" class="brend" name="brend"/><span class="mx-2">${b.name}</span>
                    </li>`;
        });
        $("#brands").html(html);
        brendovi = data;
        $(".brend").change(filterChange);
    }

    //Ispisivanje proizvoda
    function prikaziProizvode(data){
        data = pretraziProizvode(data);
        data = dostupniFilter(data);
        data = dostavaFilter(data);
        data = kategorijaFilter(data);
        data = brenodviFilter(data);
        data = sort(data);
        let html="";
        data.forEach(p=>{
            html+=`<div class="col-12 col-sm-6 col-md-4 mt-2">
                        <div class="card text-center border-0 ">
                            <img src="assets/img/products/${p.img.src}" class="card-img-top" alt="${p.img.alt}">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">${p.name}</h5>
                                <p>Cartridge : ${p.cartridge}</p>
                                <s>${staraCena(p.price.oldPrice)}</s>
                                <p class="crvena">${p.price.newPrice} $</span></br>
                                <p class="plava">${p.freeShiping?"Freeshiping":""}</p>
                                <p >${p.available?"Available":""}</p>
                                <input type="button" data-id=${p.id} value="Add to cart" class="btn crna bela dodajUkorpu">
                            </div>
                        </div>
                    </div>`;
        });
        if(!data.length){
            html=`<div class="row" id="no-products"><div class="col-12 p-3 mb-2 bg-danger text-white text-center mt-5 fw-bold mx-2">No products found</div></div>`;
        }
        $("#products").html(html);
        $(".dodajUkorpu").click(dodajUKorpu);
        $(".dodajUkorpu").click(prikaziModal);

    }   
    //Prikazivanje i uklanjanje modala
    $("#dugmeOk").click(ukloniModal);
    function ukloniModal(){
        $("#modal-container").removeClass("show");
        $("#modal-container").css({
            "z-index":"-1"
        });
    }
    function prikaziModal(){
        $("#modal-container").addClass("show");
        $("#modal-container").css({
            "z-index":"2"
        });
        setTimeout(ukloniModal,1200);
    }
    //Dodavanje proizvoda u korpu
    function dodajUKorpu(){
        let id = $(this).data("id");
        let proizvodiUKorpi = getItemLS("proizvodiKorpa");
        if(proizvodiUKorpi){
            if(proizvodVecUKorpi()){
                povecajKolicinu();
            }
            else{
                dodajProizvod();
                promeniBrojacArtikala();
                ispisiNav(meni);
            }
        }
        else{
            dodajPrviProizvod();
            promeniBrojacArtikala();
            ispisiNav(meni);
        }
        //Dodavanje prvog proizvoda u korpu
        function dodajPrviProizvod(){
            let pro = [];
            pro[0] ={
                id: id,
                kolicina:1
            };
            setItemLS("proizvodiKorpa",pro);
        }
        //Provera da li je proizvod vec u korpi
        function proizvodVecUKorpi(){
            return proizvodiUKorpi.filter(p=> p.id == id).length;
        }
        //Dodavanje novog proizvoda u korpu
        function dodajProizvod(){
            let uKorpi = getItemLS("proizvodiKorpa");
            uKorpi.push({
                id: id,
                kolicina : 1
            });
            setItemLS("proizvodiKorpa",uKorpi);
        }
        //Povecavanje kolicine proizvoda
        function povecajKolicinu(){
            let uKorpi = getItemLS("proizvodiKorpa");
            for(let i in uKorpi){
                if(uKorpi[i].id ==id){
                    uKorpi[i].kolicina++;
                    break;
                }
            }
            setItemLS("proizvodiKorpa",uKorpi);
        }

    }

    function staraCena(cena){
        if(cena==null){
            return "";
        }
        else{
            return cena+' $';
        }
    }
    //Pretraga
    $("#pretraga").keyup(filterChange);
    function pretraziProizvode(data){
        let pretraga = $("#pretraga").val().toLowerCase();
        if(pretraga){
            return data.filter(function(p){
                console.log(p);
                return p.name.toLowerCase().indexOf(pretraga) !== -1;
            });
        }
        return data;
    }
    //Sortiranje
    $("#sortBy").change(filterChange);
    function sort(data){
        vrednostSorta = $("#sortBy").val();
        if(vrednostSorta=="0"){
            return data;
        }
        if(vrednostSorta=="priceAsc"){
            data.sort((a,b)=>parseFloat(a.price.newPrice)<parseFloat(b.price.newPrice)? 1: -1);
            return data;
        }
        if(vrednostSorta=="priceDesc"){
            data.sort((a,b)=>parseFloat(a.price.newPrice)>parseFloat(b.price.newPrice)? 1: -1);
            return data;
        }
        if(vrednostSorta=="nameAsc"){
            data.sort((a,b)=>a.name>b.name? 1: -1);
            return data;
        }
        if(vrednostSorta=="nameDesc"){
            data.sort((a,b)=>a.name<b.name? 1: -1);
            return data;
        }
    }
    //Filter za dostupnost
    $(".aval").change(filterChange);
    function dostupniFilter(data){
        dostupnost = $("input[name='avaliable']:checked").val();
        if(dostupnost=="all"){
            return data;
        }
        if(dostupnost=="avaliable"){
            return data.filter(el=>el.available)
        }
        if(dostupnost=="notAvaliable"){
            return data.filter(el=>!el.available)
        }
        return data;
    }
    //Filter za dostavu
    $(".frShip").change(filterChange);
    function dostavaFilter(data){
        dostupnost = $("input[name='freeshipping']:checked").val();
        if(dostupnost=="all"){

            return data;
        }
        if(dostupnost=="fS"){
            return data.filter(el=>el.freeShiping)
        }
        return data;
    }
    //Filter za kategoriju
    function kategorijaFilter(data){
        let selektovani=[];
        $(".kategorija:checked").each(function(el){
            selektovani.push(parseInt($(this).val()));
        });
        if(selektovani.length!=0){
            return data.filter(x=>selektovani.includes(x.categorieId));
        }
        return data;
    }
    //Filter za brendove
    function brenodviFilter(data){
        let selektovani=[];
        $(".brend:checked").each(function(el){
            selektovani.push(parseInt($(this).val()));
        });
        if(selektovani.length!=0){
            return data.filter(x=>selektovani.includes(x.brandId));
        }
        return data;
    }
    //Primena filtera
    function filterChange(){
        prikaziProizvode(proizvodi);
    }
    
}
if(url=="/gunsmith/order.html"){
    setTimeout(ukloni,800);
    let tacnostIme = false;
    let tacnostPrezime = false;
    let tacnostDrzava=false;
    let tacnostGrad = false;
    let tacnostAdresa = false;
    let tacnostPlacanje = false;
    function proveriPrazan(vrednost,idGreske,tacnost){
        if(vrednost==""){
            $(idGreske).html("You can't leave the field blank")
            console.log(idGreske);
            $(idGreske).removeClass("sakrij");
            tacnost =false;
            return true;
        }
    }
    //Provera imena
    $("#ime").blur(proveriIme);
    function proveriIme(){
        var regIme = /^[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}(\s[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}){0,1}$/;
        var idGreske = $("#greskaIme");
        var ime = $("#ime").val();
        if(proveriPrazan(ime,idGreske,tacnostIme)){

        }
        else if(!regIme.test(ime)){
            $(idGreske).html("First Name must begin with capital letter");
            $(idGreske).removeClass("sakrij");
            tacnostIme =false;
        }
        else if(regIme.test(ime)){
            $(idGreske).addClass("sakrij");
            tacnostIme = true;
        }
    }
    //Provera prezimena
    $("#prezime").blur(proveriPrezime);
    function proveriPrezime(){
        var regPrezime = /^[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}(\s[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}){0,1}$/;
        var idGreske = $("#greskaPrezime");
        var prezime = $("#prezime").val();
        if(proveriPrazan(prezime,idGreske,tacnostPrezime)){

        }
        else if(!regPrezime.test(prezime)){
            $(idGreske).html("Last Name must begin with capital letter");
            $(idGreske).removeClass("sakrij");
            tacnostPrezime =false;
        }
        else if(regPrezime.test(prezime)){
            $(idGreske).addClass("sakrij");
            tacnostPrezime = true;
        }
    }
    //Provera drzave
    $("#drzava").blur(proveriDrzavu);
    function proveriDrzavu(){
        var regDrzava = /^[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}(\s[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}){0,5}$/;
        var idGreske = $("#greskaDrzava");
        var drzava = $("#drzava").val();
        if(proveriPrazan(drzava,idGreske,tacnostDrzava)){

        }
        else if(!regDrzava.test(drzava)){
            $(idGreske).html("State must begin with capital letter");
            $(idGreske).removeClass("sakrij");
            tacnostDrzava =false;
        }
        else if(regDrzava.test(drzava)){
            $(idGreske).addClass("sakrij");
            tacnostDrzava = true;
        }
    }
    //Provera grada
    $("#grad").blur(proveriGrad);
    function proveriGrad(){
        var regGrad = /^[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}(\s[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}){0,5}$/;
        var idGreske = $("#greskaGrad");
        var grad = $("#grad").val();
        if(proveriPrazan(grad,idGreske,tacnostGrad)){

        }
        else if(!regGrad.test(grad)){
            $(idGreske).html("City must begin with capital letter");
            $(idGreske).removeClass("sakrij");
            tacnostGrad =false;
        }
        else if(regGrad.test(grad)){
            $(idGreske).addClass("sakrij");
            tacnostGrad = true;
        }
    }
    $("#adresa").blur(proveriAdresu);
    //Provera adrese
    function proveriAdresu(){
        var regAdresa = /[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}(\s[A-ZČĆŠĐŽ][a-zčćžđš]{2,15}(\s(\d{1,4}))*){0,2}/;
        var idGreske = $("#greskaAdresa");
        var adresa = $("#adresa").val();
        if(proveriPrazan(adresa,idGreske,tacnostAdresa)){

        }
        else if(!regAdresa.test(adresa)){
            $(idGreske).html("Address must begin with capital letter");
            $(idGreske).removeClass("sakrij");
            tacnostAdresa =false;
        }
        else if(regAdresa.test(adresa)){
            $(idGreske).addClass("sakrij");
            tacnostAdresa = true;
        }
    }
    //Provera nacina placanja
    $("#nacinPlacanja").blur(proveriPlacanje);
    function proveriPlacanje(){
        var placanje = $("#nacinPlacanja").val();
        var idGreske=$("#greskaPlacanje");
        if(placanje==0){
            $(idGreske).removeClass("sakrij");
            tacnostPlacanje =false;
        }
        else{
            $(idGreske).addClass("sakrij");
            tacnostPlacanje = true;
        }
    }
    $("#naruci1").click(proveriFormu);
    $("#dugmeOk").click(ukloniModal);
    function ukloniModal(){
        $("#modal-container").removeClass("show");
        $("#modal-container").css({
            "z-index":"-1"
        });
    }
    function prikaziModal(){
        $("#modal-container").addClass("show");
        $("#modal-container").css({
            "z-index":"2"
        });
        setTimeout(ukloniModal,1200);
    }
    //Provera cele forme
    function proveriFormu(){
        proveriIme();
        proveriPrezime();
        proveriDrzavu();
        proveriGrad();
        proveriAdresu();
        proveriPlacanje();
        if(tacnostIme && tacnostPrezime && tacnostDrzava && tacnostGrad && tacnostAdresa && tacnostPlacanje){
           var stanjeUKorpi = getItemLS("proizvodiKorpa");
           if(stanjeUKorpi==null || stanjeUKorpi.length==0){
                $("#modalKontakt").html("To order, You must have product in cart!");
                prikaziModal();
           }
           else{
            $("#modalKontakt").html("You have successfully ordered!");
            prikaziModal();
            setItemLS("proizvodiKorpa",[]);
            localStorage.setItem("brojArtikala","0");
            setTimeout(ucitajStranu,1200)
           }
        }
        function ucitajStranu(){
            location.reload();
        }
    }
}
//Cart JS
if(url=="/gunsmith/cart1.html"){
    setTimeout(ukloni,800);
    let uKorpi= getItemLS("proizvodiKorpa");
    ispisiKorpu();
    //Ispisivanje korpe
    function ispisiKorpu(){
        html="";
        let ukupnaCena =0;
    if(!uKorpi || uKorpi.length==0){
        html=`<div class="p-3 mb-2 bg-danger text-white text-center mt-5 fw-bold">Cart is empty</div>`;
    }
    else{
        for(i=0;i<uKorpi.length;i++){
            for(j=0;j<proizvodi.length;j++){
                if(uKorpi[i].id==proizvodi[j].id){
                    html+=`<div class="row mx-0 my-2 align-items-center border border-3 p-2 proizvod">
                            <div class="col-4 col-lg-2">
                                <img src="assets/img/products/${proizvodi[j].img.src}" class="img-fluid" alt="${proizvodi[j].img.alt}"/>
                            </div>
                            <div class="col-8 col-lg-5">
                                <p class="fw-bold textUKorpi">${proizvodi[j].name}</p>
                            </div>
                            <div class="col-6 col-lg-3 mt-3 mt-lg-0">
                                <p>Quantity:</p>
                                <input type="number" data-id="${proizvodi[j].id}" class="kolicina" min="1" value="${uKorpi[i].kolicina}" max="100">
                                <span class="fw-bold mx-2">${(parseFloat(proizvodi[j].price.newPrice)*uKorpi[i].kolicina).toFixed(2)}$</span>
                            </div>
                            <div class="col-6 col-lg-2 text-right">
                                 <a href="#" class="btn btn-danger obrisi" data-id="${proizvodi[j].id}">Remove</a>
                            </div>
                        </div>`
                        ukupnaCena +=parseFloat(proizvodi[j].price.newPrice)*uKorpi[i].kolicina;
                }
            }
            if(uKorpi.length-1==i){
                html+=`<div class="w-100 text-end pb-5">
                <p>
                    Price: <span id="ukupnaCena">${ukupnaCena.toFixed(2)} $</span>
                </p>
                <a href="#" id="naruci" class="btn crna bela">Order</a>
                <a href="#" id="ukloniSve" class="btn btn-danger">Remove all</a>

            </div>`;
            }
        }
    }

    $("#prikazKorpe").html(html);
    $(".obrisi").click(ukloniProizvodIzKorpe);
    $(".kolicina").change(promeniKolicinu);
    $("#ukloniSve").click(ukloniSveKorpa);
    $("#naruci").click(redirektuj);
    function redirektuj(){
        location.href="order.html";
    }
    }  
    //Uklanjanje svega iz kope
    function ukloniSveKorpa(){
        uKorpi=[];
        setItemLS("proizvodiKorpa",uKorpi);
        localStorage.setItem("brojArtikala","0");
        ispisiNav(meni);
        ispisiKorpu();
    }
    //Promena kolicine u korpi
    function promeniKolicinu(){
        for(i=0;i<uKorpi.length;i++){
            if(uKorpi[i].id==$(this).attr("data-id")){
                if($(this).val()<1){
                    $(this).val(1);
                }
               uKorpi[i].kolicina = $(this).val();
            }
        }
        setItemLS("proizvodiKorpa",uKorpi);
        ispisiKorpu();
    }  
    //Uklanjanje proizvoda iz korpe
    function ukloniProizvodIzKorpe(){
        for(i=0;i<uKorpi.length;i++){
            if(uKorpi[i].id==$(this).attr("data-id")){
                console.log($(this).attr("data-id"))
                uKorpi.splice(i,1);
                i--;
            }
        }
        setItemLS("proizvodiKorpa",uKorpi);
        ispisiKorpu();
        umanjiBrojacArtikala();
        ispisiNav(meni);
    }
}
})
