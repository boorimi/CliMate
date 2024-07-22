<%@ page contentType="text/html; charset=utf-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- menu font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
            href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&family=Rampart+One&display=swap"
            rel="stylesheet"
    />
    <title>Hamburger Title</title>
    <link rel="stylesheet" href="resources/css/index.css">
    <script src="resources/js/index.js"></script>
</head>
<body>
<nav class="menu">
    <div class="logo" onclick="location.href='/'"><img src=""><p>CliMate</p></div>
    <div class="hamburger" onclick="toggleMenu()">
        <div class="hamburger-bar"></div>
        <div class="hamburger-bar"></div>
        <div class="hamburger-bar"></div>
    </div>
    <ul class="hamburger-menu">
        <li onclick="location.href='map'"><img src="resources/icon/search.png" />地図</li>
        <li onclick="location.href='simulator'"><img src="resources/icon/hold.png" />シミュレーター</li>
        <li onclick="location.href='community'"><img src="resources/icon/community.png" />コミュニティ</li>
        <li onclick="location.href='login'"><img src="resources/icon/bag.png" />login</li>
    </ul>
</nav>
</body>
</html>