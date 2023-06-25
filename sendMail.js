function sendMail() {
    const maiL = document.getElementById('emailadd');
    const wiadOmosc = document.getElementById('wiadomosc');
    const imieNaz = document.getElementById("fname")+ " " + document.getElementById("lname");
    const poZiom = document.getElementById("poziom");
    const teLL = document.getElementById("telnumm");
    const wiadoMosc2 = "Imię i Nazwisko: "+imieNaz+"\n" +"E-mail: "+ mail+ "\n"+"Numer Telefonu: "+teLL+"\n"+"Poziom"+poZiom+"\n"+ wiadOmosc;
    console.log(wiadoMosc2);
    return wiadoMosc2
}

function wySliJJ (){
    const myMail = "knabelaleksandra@gmail.com"
    const magFrom = sendMail()


}