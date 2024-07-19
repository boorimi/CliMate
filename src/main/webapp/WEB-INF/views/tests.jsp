<%@ page contentType="text/html; charset=utf-8" %>
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
    <%--    <h1 onclick="location.href='test-json?no=${t.no}'"> ${t} / ${t.no}</h1>--%>
    <h1> ${t} / ${t.no} /
        <button class="async-test" value="${t.no}">비동기테스트</button>
    </h1>
</c:forEach>

<script>
    // 비동기 예시
    let elements = document.querySelectorAll('.async-test');
    elements.forEach((el) => {
        el.addEventListener("click", () => {
            fetch("test-json?no=" + el.value)
                .then(response => response.json()) // 응답을 JSON으로 변환
                .then(data => {
                    alert(JSON.stringify(data));
                    console.log('Success:', data); // 응답 데이터를 처리
                });
        });
    });
</script>

</body>
</html>