$(document).ready(function () {
    let userId = $('#userId').text();

    $(".s-menu-create").click(function (){
        if (userId != null && userId != ""){
            location.href="/simulator/create";
        } else {
            alert("Available after login");
        }
    })

    $(".s-menu-my-project").click(function (){
        if (userId != null && userId != ""){
            location.href="/simulator/my_project";
        } else {
            alert("Available after login");
        }
    })

    $(".s-menu-gallery").click(function (){
        location.href="/simulator/gallery?category=All";
    })
})