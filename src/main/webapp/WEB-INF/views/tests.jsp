<%@ page contentType="text/html; charset=utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="resources/css/test.css">
    <script src="resources/js/test.js"></script>
</head>
<body>
${tests}

<c:forEach var="t" items="${tests}">
    <h1 onclick="location.href='test-json?no=${t.no}'"> ${t} / ${t.no}</h1>
</c:forEach>
</body>



</html>