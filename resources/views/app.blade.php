<!DOCTYPE html>
<html lang="en">
<head>
    <title>UniCity</title>

    
<link href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/main.jsx'])

    @isset($page)
        @inertiaHead
    @endisset
</head>
<body>
    <div id="root"></div>
</body>
</html>
