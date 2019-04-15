$(document).ready(()=>{
    
    let form = $(".form");
    let ul = $("ul");
    let c = ul.prop("id"); // id for fle input
    let q = ul.prop("class"); //name for text
    var count_c = parseInt(c,10);
    var count_q = parseInt(q,10);

    let li;
    let input;
    let text_ar;
    let span;
    let map = [
        "li-text-1",
        "li-file-1"
    ];
     $(".add-photo").click(()=>{
        ++count_c;     
        li             = document.createElement("li");
        input          = document.createElement("input");
        span           = document.createElement("span")
        span.innerHTML = "X";
        span.setAttribute("class","span");
        li.setAttribute("class","li-file-"+count_c);
        input.setAttribute("type","file");
        input.setAttribute("name","img-"+count_c);
        input.setAttribute("class","img-"+count_c);
        
        li.append(span);
        li.append(input);
        ul.append(li);
        ul.prop("id",count_c);
        map.push("li-file-"+count_c);
     });
    $(".add-text").click(()=>{
        ++count_q;
        li             = document.createElement("li");
        span           = document.createElement("span")
        span.innerHTML = "X";
        text_ar        = document.createElement("textarea");
        span.setAttribute("class","span");
        li.setAttribute("class", "li-text-" + count_q);
        text_ar.setAttribute("class", "text_"+count_q);
        text_ar.setAttribute("name", "text_"+count_q);
       
        li.append(span);
        li.append(text_ar);
        ul.append(li);
        ul.prop("class", count_q);
        map.push("li-text-"+count_q);
    });
    
    ul.delegate("li span","click",(e)=>{ 
        let elem = e.currentTarget.parentElement;
        elem.remove();
        console.log(elem.className);
        let new_map = map.filter((item)=>!item.includes(elem.className));
        console.log(new_map);
    });


    ul.on("change", "input", (e)=>{
        let i = e.currentTarget.attributes.class.value;
        let self = $(`.${i}`);
        readURL(e.currentTarget, self);        
    });
    
    $("#form").submit((event)=>{
        event.preventDefault();
        var payload = new FormData();
        var input = $("input");
        var textarea = $("textarea");
        $.each(input,(index, value)=>{
            if(value.files[0])
                payload.append("img", value.files[0]);
        });

        $.each(textarea, (index, val)=>{
            if(val.value.trim() !== ""){
                payload.append(`${val.name}`, val.value);
            }
        })
        payload.append("count_img", count_c);
        payload.append("count_text", count_q);
        $.ajax({
            url: '/test',
            type: 'post',
            data: payload,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log("data");
            }
        });
      
    })
});//end of document ready-----------------------------------------------

const check_empty = (element)=>{
    if(element.is(":empty")){
        element.remove();
    }
}

function readURL(input, self) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
           self.after(`<img src="${e.target.result}" with="350px" height="200px"/>`);
        }
        reader.readAsDataURL(input.files[0]);
    } 
}

const remove_elem=(class_name)=>{
    $(`.${class_name}`).remove();
}