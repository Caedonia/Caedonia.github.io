window.onload = function(){
document.getElementById('wyslij').addEventListener('click', wySliJJ);
console.log("im running");}

function wySliJJ (){
emailjs.send("service_pqniaal","template_zazqo39",{
from_name: document.getElementById("fname")+" "+document.getElementById("lname"),
to_name: "Aleksandra Knabel",
message: "numer telefonu: "+document.getElementById("telnumm")+" poziom: "+document.getElementById("poziom")+" "+document.getElementById("wiadomosc"),
reply_to: document.getElementById("emailadd")
});
console.log("it run");
    }