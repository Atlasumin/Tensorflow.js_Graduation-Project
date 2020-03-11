//  上传照片
$(".fileinput").change(function () {
    var file = this.files[0];
    readFile(file, $(this).parent().siblings(".on"));
});
//  鼠标在图片上传后鼠标移动的变化
$(".on").mouseover(function () {
    $(this).children(".xian").show();
    $(this).children(".chahao").show();
});
$(".on").mouseleave(function () {
    $(this).children(".xian").hide();
    $(this).children(".chahao").hide();
});
$(".on").mouseover(function () {
    $(this).children(".mengban").show();
    $(this).children(".xiazai").show();
});
$(".on").mouseleave(function () {
    $(this).children(".mengban").hide();
    $(this).children(".xiazai").hide();
});
//  删除所上传的照片
$(".chahao").click(function () {
    $(this).next().remove();
    $(".xian").hide();
    $(".chahao").hide();
    $(this).parent().hide();
    $(this).parent().siblings(".addhao").show();
    $(this).parent().siblings(".addhao").children().val("");
     location.reload()
});

//  获取当前元素
var on = document.querySelector(".on");

function readFile(file, element) {
    var reader = new FileReader();
    switch (file.type) {
        case 'image/jpg':
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
            reader.readAsDataURL(file);
            
            break;
    }

    reader.addEventListener('load', function () {
        switch (file.type) {
            case 'image/jpg':
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
                var img = document.getElementById('img');
                console.log(reader.result)
                img.src = reader.result;
                element.append(img);
                element.siblings(".addhao").hide();
                element.show();
                break;
        }
    });
}
