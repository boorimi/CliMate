<%@ page contentType="text/html; charset=utf-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <%--미디어쿼리 쓸 때에 추가해주기--%>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="resources/css/main.css" />
    <!-- title font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
            href="https://fonts.googleapis.com/css2?family=Rampart+One&display=swap"
            rel="stylesheet"
    />
    <!-- menu font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
            href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&family=Rampart+One&display=swap"
            rel="stylesheet"
    />

    <script
            src="https://code.jquery.com/jquery-3.6.0.min.js"
            integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
            crossorigin="anonymous"
    ></script>
    <script src="resources/js/main.js" defer></script>
</head>
<body>
<div class="main-container">
    <div class="main-background-img">
        <img src="resources/img/main1.jpg" />
        <img src="resources/img/main2.jpg" />
        <img src="resources/img/main3.jpg" />
        <img src="resources/img/main4.jpg" />
        <img src="resources/img/main5.jpg" />
    </div>
    <div class="main-menu-container">
        <div class="main-title">
            <div><img src="" /></div>
            <div>クライメイト</div>
        </div>
        <div class="main-map" onclick="location.href='map'">
            <div class="main-map-img"><img src="resources/icon/search.png" /></div>
            <div>地図</div>
        </div>
        <div class="main-simulator" onclick="location.href='simulator'">
            <div class="main-simulator-img"><img src="resources/icon/hold.png" /></div>
            <div>シミュレーター</div>
        </div>
        <div class="main-community" onclick="location.href='community'">
            <div class="main-community-img"><img src="resources/icon/community.png" /></div>
            <div>コミュニティ</div>
        </div>
        <div class="main-login" onclick="location.href='login'">
            <img src="resources/icon/login.png" />
        </div>
    </div>
</div>
</body>
</html>