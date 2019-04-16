
$(document).ready(()=>{
    
    let form = $("#form");
    let ul = $("ul");
    let c = ul.prop("id"); // id for fle input
    let q = ul.prop("class"); //name for text
    let h = form.prop("class")
    
    var count_c = parseInt(c,10);
    var count_q = parseInt(q,10);
    var count_h = parseInt(h,10);

    let li;
    let input;
    let text_ar;
    let span;
    let image_map = ["file_1"];
    let map = [
        "text_1",
        "head_1",
        "file_1"
    ];
     $(".add-photo").click(()=>{
        ++count_c;     
        let class_ = "file_" + count_c;
        li             = document.createElement("li");
        input          = document.createElement("input");
        span           = document.createElement("span")
        span.innerHTML = "X";
        span.setAttribute("class","span");
        li.setAttribute("class",class_);
        input.setAttribute("type","file");
        input.setAttribute("name","img-"+count_c);
        input.setAttribute("class","img-"+count_c);
        input.setAttribute("id","img");
        
        li.append(span);
        li.append(input);
        ul.append(li);
        ul.prop("id",count_c);
        map.push(class_);
        image_map.push("file_"+count_c);
        console.log("added",class_);
        console.log("map",map);
        console.log("image_map",image_map);
        
        
     });
    $(".add-text").click(()=>{
        ++count_q;
        let class_ = "text_" + count_q;
        li             = document.createElement("li");
        span           = document.createElement("span")
        span.innerHTML = "X";
        text_ar        = document.createElement("textarea");
        span.setAttribute("class","span");
        li.setAttribute("class", class_);
        text_ar.setAttribute("class", "text_"+count_q);
        text_ar.setAttribute("name", "text_"+count_q);
       
        li.append(span);
        li.append(text_ar);
        ul.append(li);
        form.prop("class", count_q);
        // console.log("add",class_);
        map.push(class_);
        // console.log("map",map);
        
    });
    $(".add-header").click(()=>{
        ++count_h;
        let class_ = "head_" + count_h;
        li             = document.createElement("li");
        span           = document.createElement("span")
        let header     = document.createElement("input");
        span.innerHTML = "X";
        header.setAttribute("name","head_"+count_h);
        header.setAttribute("class",class_);
        header.setAttribute("type","text")
        header.setAttribute("id","head")
        span.setAttribute("class","span");
        li.setAttribute("class", "head_" + count_h);
       
        li.append(span);
        li.append(header);
        ul.append(li);
        form.prop("class", count_h);
        // console.log("added",class_);
        map.push(class_);
        // console.log("map",map);
        
    });
    
    ul.delegate("li span","click",(e)=>{ 
        let elem = e.currentTarget.parentElement;
        elem.remove();
        let new_map = map.filter((item)=>!item.includes(elem.className));        
         let new_img_map = image_map.filter(item=> item !== (elem.className));
        image_map = null;
        image_map = [...new_img_map];
        map = null;
        map = [...new_map];
        console.log("image_map",image_map);
        console.log("map",map);
    });


    ul.on("change", "input[type='file']", (e)=>{
        let i = e.currentTarget.attributes.class.value;
        let self = $(`.${i}`);
        readURL(e.currentTarget, self);        
    });

    $("#form").submit((event)=>{
        var payload = new FormData();
        var title = $(".title");
        var input = $("input[type='file']");
        var input_h = $("input[type='text']").not(".title");
        var textarea = $("textarea");     
        $.each(input,(index, value)=>{
            if(value.files && value.files[0]){
                payload.append("img", value.files[0]);
            }
        });
        $.each(textarea, (index, val)=>{
            if(val.value.trim() !== ""){
                payload.append(`${val.name}`, val.value);
            }
        })
        $.each(input_h, (index, val)=>{
            if(val.value.trim() !== ""){
                payload.append(`${val.name}`, val.value);
            }
        });     
 
        payload.append("title", title.val());
        payload.append("image_map",image_map);
        payload.append("map",map);
        $.ajax({
            url: '/test',
            type: 'post',
            data: payload,
            contentType: false,
            processData: false,
            success: function (data) {
                // console.log("data");
                // window.location.href = "/done"
            }
        });
        event.preventDefault();
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