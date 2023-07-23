src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"


function sendMail() {
    const maiL = document.getElementById('emailadd');
    const wiadOmosc = document.getElementById('wiadomosc');
    const imieNaz = document.getElementById("fname")+ " " + document.getElementById("lname");
    const poZiom = document.getElementById("poziom");
    const teLL = document.getElementById("telnumm");
    const wiadoMosc2 = "Imię i Nazwisko: "+imieNaz+"\n" +"E-mail: "+ maiL+ "\n"+"Numer Telefonu: "+teLL+"\n"+"Poziom"+poZiom+"\n"+ wiadOmosc;
    console.log(wiadoMosc2);
    return wiadoMosc2
}

function wySliJJ (){
    document.getElementById('wyslij').addEventListener('click',function(){
        emailjs.init("bbaBDm_e0rMMG4bZQ");

emailjs.send("service_pqniaal","template_zazqo39",{
from_name: document.getElementById("fname")+" "+document.getElementById("lname"),
to_name: "Aleksandra Knabel",
message: "numer telefonu: "+document.getElementById("telnumm")+" poziom: "+document.getElementById("poziom")+" "+document.getElementById("wiadomosc"),
reply_to: document.getElementById("emailadd")
});
    })
    
}