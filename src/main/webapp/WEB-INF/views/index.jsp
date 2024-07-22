<%@ page contentType="text/html; charset=utf-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <%--미디어쿼리 쓸 때에 추가해주기--%>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="resources/css/index.css" />
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
    <title>Title</title>
</head>
<body>
<div class="menu-container">
    <div class="menu-logo" onclick="location.href='/'"><img src=""><p>CliMate</p></div>
    <div class="menu-map" onclick="location.href='map'">
        <div class="menu-map-img"><img src="resources/icon/search.png" /></div>
        <div>地図</div>
    </div>
    <div class="menu-simulator" onclick="location.href='simulator'">
        <div class="menu-simulator-img"><img src="resources/icon/hold.png" /></div>
        <div>シミュレーター</div>
    </div>
    <div class="menu-community" onclick="location.href='community'">
        <div class="menu-community-img"><img src="resources/icon/community.png" /></div>
        <div>コミュニティ</div>
    </div>
    <div class="menu-login" onclick="location.href='login'">
        <img src="resources/icon/login.png" />
    </div>
</div>
<div class="content">
<%--<jsp:include page="${content }"></jsp:include>--%>
</div>
</body>
</html>